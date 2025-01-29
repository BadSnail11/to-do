'use client'; // Указываем, что это клиентский компонент

import { useState } from 'react';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Состояние для модального окна входа
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Состояние для модального окна регистрации

  // Функции для открытия/закрытия модальных окон
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  // Функция для обработки отправки формы входа
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Форма входа отправлена');
    closeModals();
  };

  // Функция для обработки отправки формы регистрации
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Форма регистрации отправлена');
    closeModals();
  };

  return (
    <nav className="navbar">
      <div className="navbarTitle">Мой Сервис Заметок</div>
      <div className="navbarButtons">
        <button className="button" onClick={openLoginModal}>
          Войти
        </button>
        <button className="button" onClick={openRegisterModal}>
          Зарегистрироваться
        </button>
      </div>

      {/* Модальное окно для входа */}
      {isLoginModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Вход в систему</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="formGroup">
                <label htmlFor="username">Логин:</label>
                <input
                  type="text"
                  id="username"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  required
                />
              </div>
              <button type="submit" className="button">
                Войти
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={closeModals}
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для регистрации */}
      {isRegisterModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="formGroup">
                <label htmlFor="username">Логин:</label>
                <input
                  type="text"
                  id="username"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                />
              </div>
              <button type="submit" className="button">
                Зарегистрироваться
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={closeModals}
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}