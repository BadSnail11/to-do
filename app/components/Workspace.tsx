'use client'; // Указываем, что это клиентский компонент

import { useState } from 'react';

// Тип для заметки
type Note = {
  id: number;
  text: string;
  position: { x: number; y: number };
};

export default function Workspace() {
  const [notes, setNotes] = useState<Note[]>([]); // Состояние для списка заметок
  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null); // Состояние для перетаскиваемой заметки
  const [contextMenu, setContextMenu] = useState<{
    noteId: number;
    x: number;
    y: number;
  } | null>(null); // Состояние для контекстного меню

  // Функция для добавления новой заметки
  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: 'Новая заметка',
      position: { x: 100, y: 100 }, // Начальная позиция
    };
    setNotes([...notes, newNote]);
  };

  // Функция для изменения текста заметки
  const updateNoteText = (id: number, text: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, text } : note
      )
    );
  };

  // Функция для начала перетаскивания
  const startDragging = (id: number) => {
    setDraggingNoteId(id);
  };

  // Функция для перемещения заметки
  const moveNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingNoteId !== null) {
      const updatedNotes = notes.map((note) =>
        note.id === draggingNoteId
          ? {
              ...note,
              position: {
                x: e.clientX - 100, // Центрируем стикер по курсору
                y: e.clientY - 50,
              },
            }
          : note
      );
      setNotes(updatedNotes);
    }
  };

  // Функция для завершения перетаскивания
  const stopDragging = () => {
    setDraggingNoteId(null);
  };

  // Функция для открытия контекстного меню
  const openContextMenu = (e: React.MouseEvent, noteId: number) => {
    e.preventDefault(); // Отключаем стандартное контекстное меню
    setContextMenu({
      noteId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Функция для закрытия контекстного меню
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Функция для удаления заметки
  const deleteNote = (noteId: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    closeContextMenu();
  };

  // Функция для завершения заметки
  const completeNote = (noteId: number) => {
    alert(`Заметка ${noteId} завершена!`);
    closeContextMenu();
  };

  // Функция для связи заметок
  const linkNote = (noteId: number) => {
    alert(`Заметка ${noteId} связана!`);
    closeContextMenu();
  };

  return (
    <div
      className="workspace"
      onMouseMove={moveNote}
      onMouseUp={stopDragging}
      onClick={closeContextMenu} // Закрываем контекстное меню при клике вне его
    >
      {/* Список заметок */}
      {notes.map((note) => (
        <div
          key={note.id}
          className="note"
          style={{
            left: note.position.x,
            top: note.position.y,
          }}
        >
          {/* Красная кнопка для перемещения */}
          <div
            className="dragHandle"
            onMouseDown={() => startDragging(note.id)}
            onContextMenu={(e) => openContextMenu(e, note.id)}
          />

          {/* Текстовое поле для заметки */}
          <textarea
            value={note.text}
            onChange={(e) => updateNoteText(note.id, e.target.value)}
            placeholder="Введите текст заметки..."
          />
        </div>
      ))}

      {/* Контекстное меню */}
      {contextMenu && (
        <div
          className="contextMenu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button onClick={() => linkNote(contextMenu.noteId)}>Связать</button>
          <button onClick={() => completeNote(contextMenu.noteId)}>
            Завершить
          </button>
          <button onClick={() => deleteNote(contextMenu.noteId)}>Удалить</button>
        </div>
      )}

      {/* Кнопка добавления заметки */}
      <button className="addNoteButton" onClick={addNote}>
        +
      </button>
    </div>
  );
}