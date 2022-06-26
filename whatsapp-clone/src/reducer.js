export const initialState = {
  basket: [],
  userId: "",
  contact: 0,
  currentUser: 0,
  messageRecieved: false,
};

// Selector

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_USERID":
      return {
        ...state,
        userId: action.userId,
      };

    case "SET_USERCONTACT":
      return {
        ...state,
        contact: action.contact,
      };

    case "SET_CURRENTUSER":
      return {
        ...state,
        currentUser: action.currentUser,
      };

    case "SET_MESSAGERECIEVED":
      return {
        ...state,
        messageRecieved: action.messageRecieved,
      };

    default:
      return state;
  }
};

export default reducer;
