import React, { createContext, useContext, useState, useEffect } from 'react';

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState(() => {
    // Load cards from localStorage on initial render
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (newCard) => {
    setCards(prevCards => [...prevCards, { ...newCard, id: Date.now().toString() }]);
  };

  const editCard = (updatedCard) => {
    setCards(prevCards => 
      prevCards.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
  };

  const deleteCard = (cardId) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };

  return (
    <CardContext.Provider value={{ cards, addCard, editCard, deleteCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}; 