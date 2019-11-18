import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import _uniqBy from 'lodash/uniqBy'
import _uniq from 'lodash/uniq'

const initialState = {
  conversations: {},
  members: {},
  messages: {},
  typing: {},

  lastMessages: {},
  unreadMessagesCount: {},
  activeConversations: (sessionStorage.getItem('activeConversations') || '').split(',').filter(Boolean),
}

const conversations = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.conversations }

    case 'SET_ACTIVE_CONVERSATION': {
      const activeConversations = _uniq(action.payload.activeConversations)
      sessionStorage.setItem('activeConversations', activeConversations.toString())
      return { ...state, activeConversations }
    }

    case 'ADD_ACTIVE_CONVERSATION': {
      const { id } = action.payload
      const activeConversations = _uniq([...state.activeConversations, id])
      sessionStorage.setItem('activeConversations', activeConversations.toString())
      return { ...state, activeConversations }
    }

    case 'REMOVE_ACTIVE_CONVERSATION': {
      const { id } = action.payload
      const activeConversations = state.activeConversations.filter(_id => _id !== id)
      sessionStorage.setItem('activeConversations', activeConversations.toString())
      return { ...state, activeConversations }
    }

    case 'SET_MEMBERS': {
      const { id, members } = action.payload
      return {
        ...state,
        members: {
          ...state.members,
          [id]: members,
        },
      }
    }

    case 'SET_TYPING': {
      const { id, data } = action.payload
      return {
        ...state,
        typing: {
          ...state.typing,
          [id]: data,
        },
      }
    }

    case 'SET_UNREAD_MESSAGES_COUNT': {
      const { id, count } = action.payload
      const updates = { ...state, unreadMessagesCount: { ...state.unreadMessagesCount, [id]: count } }
      const all = Object.values(updates.unreadMessagesCount).reduce((prev, current) => prev + +current, 0)
      document.title = `Sup Chat ${all ? `(${all})` : ''}`
      return updates
    }

    case 'SET_MESSAGES':
      const { id, messages } = action.payload

      const list = _uniqBy(_sortBy(
        state.messages[id] ? [...state.messages[id], ...messages] : messages,
        'date',
      ), (msg) => msg.id)

      return {
        ...state,
        messages: {
          ...state.messages,
          [id]: list,
        },
      }
    default:
      return state
  }
}

export default conversations

export const selectTypingUsername = (id) => (store) => (
  _get(store, `conversations.typing[${id}].username`)
)
