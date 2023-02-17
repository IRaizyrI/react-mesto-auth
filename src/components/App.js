import Header from './Header';
import Main from './Main';
import Footer from './Footer'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import React from 'react';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfileOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''})
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', id: '', avatar: '' });
  const [cards, setCards] = React.useState([]);

  function handleCardClick (card){
    setSelectedCard({name: card.name, link: card.link})
    setIsImagePopupOpen(true);
  };
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
  }).catch(err => console.log(err.message));
};
  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
  }).catch(err => console.log(err.message));
};


  const handleIsEditAvatarPopupOpen = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleIsAddPlacePopupOpen = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleIsEditProfileOpen = () => {
    setIsEditProfileOpen(true);
  };
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfileOpen(false);
    setIsImagePopupOpen(false);
  };
  function handleCloseClickOverlay(e) {
    const elementClasslist = e.target.classList
    if (elementClasslist.contains('popup__close') || elementClasslist.contains('popup_is-opened')) {
      closeAllPopups()
    }
  }
  const isOpen =  isAddPlacePopupOpen ||  isEditAvatarPopupOpen ||  isEditProfilePopupOpen ||  isImagePopupOpen;
  React.useEffect(() => {
    const closeByEscape =((evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups()
      }
    }
    )
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape)
    }
    return () => {
      document.removeEventListener('keydown', closeByEscape)
    }
  }, [isOpen])

  const handleUpdateUser = (userData) => {
    api.patchProfileInfo(userData.name, userData.about)
      .then(data => {setCurrentUser(data); closeAllPopups();})
      .catch(err => console.log(err.message));

  };
  const handleUpdateAvatar = (avatar) => {
    api.patchUserAvatar(avatar)
      .then(data => {setCurrentUser(data); closeAllPopups();})
      .catch(err => console.log(err.message));
  };
  const handleAddPlace = (cardData) => {
    api.postCard(cardData.name, cardData.link)
      .then(data => {setCards([data, ...cards]); closeAllPopups();})
      .catch(err => console.log(err.message));
  };

  React.useEffect(() => {
    api.getInitialCards().then(
      cards => setCards(cards))
      .catch(err => console.log(err.message));

    api.getProfileInfo()
      .then(data => setCurrentUser(data))
      .catch(err => console.log(err.message))
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Header/>
        <Main onEditAvatar={handleIsEditAvatarPopupOpen}
        onEditProfile={handleIsEditProfileOpen}
        onAddPlace={handleIsAddPlacePopupOpen}
        cards={cards}
        onCardClick={handleCardClick}
        onCardDelete={handleCardDelete}
        onCardLike={handleCardLike}
        />
        <Footer/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handleCloseClickOverlay} onUpdateUser={handleUpdateUser}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handleCloseClickOverlay} onAddPlace={handleAddPlace}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handleCloseClickOverlay} onUpdateAvatar={handleUpdateAvatar}/>
        <ImagePopup card={selectedCard} onClose={handleCloseClickOverlay} isOpened={isImagePopupOpen}/>
      </div>
    </CurrentUserContext.Provider>);
}

export default App;
