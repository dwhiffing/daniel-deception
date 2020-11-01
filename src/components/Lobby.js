import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Typography, Button, TextField } from '@material-ui/core'
import { Flex } from '.'
import faker from 'faker'
import truncate from 'lodash/truncate'

const joinRoomWithReconnect = async (roomId) => {
  let room,
    sessionId = localStorage.getItem(roomId)

  if (sessionId) {
    try {
      room = await window.colyseus.reconnect(roomId, sessionId)
    } catch (e) {}
  } else {
    room = room || (await window.colyseus.joinById(roomId))
  }

  return room
}

const AUTOCONNECT = true

export function Lobby({ setRoom }) {
  const intervalRef = useRef()
  const autoConnectAttempted = useRef(false)
  const [availableRooms, setAvailableRooms] = useState([])
  const [name, setName] = useState(
    localStorage.getItem('name') || faker.name.firstName(),
  )

  const enterRoom = useCallback(
    (room, name) => {
      localStorage.setItem('name', name)
      localStorage.setItem(room.id, room.sessionId)
      setRoom(room)
      room.send('setName', { name })
    },
    [setRoom],
  )

  const createRoom = useCallback(
    async (name) => {
      const roomName = prompt('Room name?')
      if (roomName) {
        const room = await window.colyseus.create('deception', { roomName })
        enterRoom(room, name)
      }
    },
    [enterRoom],
  )

  const joinRoom = useCallback(
    async (roomId, name) => {
      let room
      try {
        room = await joinRoomWithReconnect(roomId)
        if (room) {
          enterRoom(room, name)
        } else {
          alert('Failed to join room')
          localStorage.removeItem(roomId)
        }
      } catch (e) {
        alert(e)
        localStorage.removeItem(roomId)
      }
    },
    [enterRoom],
  )

  const getAvailableRooms = useCallback(
    async () => setAvailableRooms(await window.colyseus.getAvailableRooms()),
    [],
  )

  useEffect(() => {
    getAvailableRooms()
    intervalRef.current = setInterval(getAvailableRooms, 3000)
    return () => clearInterval(intervalRef.current)
  }, [getAvailableRooms])

  useEffect(() => {
    if (availableRooms) {
      const lastRoom = availableRooms.find((room) =>
        localStorage.getItem(room.roomId),
      )

      if (AUTOCONNECT && lastRoom && !autoConnectAttempted.current) {
        autoConnectAttempted.current = true
        joinRoom(lastRoom.roomId, name)
      }
    }
  }, [availableRooms, joinRoom, name])

  return (
    <Flex variant="column center" style={{ height: '100vh' }}>
      <TextField
        placeholder="Enter name"
        value={name}
        onChange={(e) =>
          setName(truncate(e.target.value, { length: 10, omission: '' }))
        }
        style={{ marginBottom: 20 }}
      />

      <Typography variant="h5">Available Tables:</Typography>

      <Flex flex={0} variant="column center" style={{ minHeight: 200 }}>
        {availableRooms.length === 0 && <EmptyState />}

        {availableRooms.map((room) => (
          <RoomListItem
            key={room.roomId}
            room={room}
            onClick={() => joinRoom(room.roomId, name)}
          />
        ))}
      </Flex>

      <Button variant="contained" onClick={() => createRoom(name)}>
        Create room
      </Button>
    </Flex>
  )
}

const RoomListItem = ({ room, onClick }) => (
  <Box>
    <Typography
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={onClick}
    >
      {room.metadata.roomName || room.roomId}
    </Typography>
  </Box>
)

const EmptyState = () => <Typography>No rooms available</Typography>
