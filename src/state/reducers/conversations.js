import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import _uniqBy from 'lodash/uniqBy'

const initialState = {
  conversations: {},
  members: {},
  messages: {},
  typing: {},

  lastMessages: {},
  activeConversations: (sessionStorage.getItem('activeConversations') || '').split(',').filter(Boolean),
}

const conversations = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.conversations }

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

    case 'SET_MESSAGES':
      const { id, messages } = action.payload

      const list = _uniqBy(_sortBy(
        state.messages[id] ? [ ...state.messages[id], ...messages ] : messages,
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
