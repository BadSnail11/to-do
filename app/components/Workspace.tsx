'use client'; // Указываем, что это клиентский компонент

import { useState, useEffect } from 'react';

// Тип для заметки
type Note = {
  id: number;
  text: string;
  position: { x: number; y: number };
  completed: boolean; // Состояние завершенности заметки
};

// Тип для связи между заметками
type Link = {
  from: number; // ID первой заметки
  to: number; // ID второй заметки
};

export default function Workspace() {
  const [notes, setNotes] = useState<Note[]>([]); // Состояние для списка заметок
  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null); // Состояние для перетаскиваемой заметки
  const [contextMenu, setContextMenu] = useState<{
    noteId: number;
    x: number;
    y: number;
  } | null>(null); // Состояние для контекстного меню
  const [linkingNoteId, setLinkingNoteId] = useState<number | null>(null); // Состояние для заметки, которую связываем
  const [links, setLinks] = useState<Link[]>([]); // Состояние для связей между заметками
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null); // Позиция курсора

  // Функция для добавления новой заметки
  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      text: 'Новая заметка',
      position: { x: 100, y: 100 }, // Начальная позиция
      completed: false, // По умолчанию заметка не завершена
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
    setLinks((prevLinks) => prevLinks.filter((link) => link.from !== noteId && link.to !== noteId));
    closeContextMenu();
  };

  // Функция для завершения заметки
  const completeNote = (noteId: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, completed: !note.completed } : note
      )
    );
    closeContextMenu();
  };

  // Функция для начала связывания заметок
  const startLinking = (noteId: number) => {
    setLinkingNoteId(noteId);
    closeContextMenu();
  };

  // Функция для завершения связывания заметок
  const finishLinking = (noteId: number) => {
    if (linkingNoteId !== null && linkingNoteId !== noteId) {
      const newLink = { from: linkingNoteId, to: noteId };

      // Проверяем, существует ли уже такая связь
      const isDuplicate = links.some(
        (link) =>
          (link.from === newLink.from && link.to === newLink.to) ||
          (link.from === newLink.to && link.to === newLink.from)
      );

      if (isDuplicate) {
        // Удаляем связь, если она уже существует
        setLinks((prevLinks) =>
          prevLinks.filter(
            (link) =>
              !(
                (link.from === newLink.from && link.to === newLink.to) ||
                (link.from === newLink.to && link.to === newLink.from)
              )
          )
        );
      } else {
        // Добавляем новую связь
        setLinks([...links, newLink]);
      }
    }
    setLinkingNoteId(null);
  };

  // Обновляем позицию курсора
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (linkingNoteId !== null) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [linkingNoteId]);

  // Функция для проверки пересечения линии с заметкой
  const isLineOverNote = (x1: number, y1: number, x2: number, y2: number, note: Note) => {
    const noteRect = {
      left: note.position.x,
      top: note.position.y,
      right: note.position.x + 200, // Ширина заметки
      bottom: note.position.y + 120, // Высота заметки
    };

    // Проверяем пересечение линии с прямоугольником заметки
    const lineIntersectsRect = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      rect: { left: number; top: number; right: number; bottom: number }
    ) => {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      // Проверяем, пересекает ли линия прямоугольник
      if (maxX < rect.left || minX > rect.right || maxY < rect.top || minY > rect.bottom) {
        return false;
      }

      return true;
    };

    return lineIntersectsRect(x1, y1, x2, y2, noteRect);
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
          id={`note-${note.id}`}
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
            onClick={() => linkingNoteId !== null && finishLinking(note.id)}
          />

          {/* Текстовое поле для заметки */}
          <textarea
            value={note.text}
            onChange={(e) => updateNoteText(note.id, e.target.value)}
            placeholder="Введите текст заметки..."
            style={{
              textDecoration: note.completed ? 'line-through' : 'none', // Зачеркиваем текст, если заметка завершена
            }}
          />
        </div>
      ))}

      {/* SVG для отрисовки линий */}
      <svg className="linesContainer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Линии между заметками */}
        {links.map((link, index) => {
          const fromNote = notes.find((note) => note.id === link.from);
          const toNote = notes.find((note) => note.id === link.to);

          if (!fromNote || !toNote) return null;

          // Координаты начала и конца линии
          const x1 = fromNote.position.x + 100; // Центр красной кнопки
          const y1 = fromNote.position.y + 10; // Смещение для центра кнопки
          const x2 = toNote.position.x + 100; // Центр красной кнопки
          const y2 = toNote.position.y + 10; // Смещение для центра кнопки

          // Проверяем, пересекает ли линия какую-либо заметку
          const isOverNote = notes.some((note) =>
            isLineOverNote(x1, y1, x2, y2, note)
          );

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth="2"
              strokeOpacity={isOverNote ? 0.5 : 1} // Полупрозрачность, если линия пересекает заметку
            />
          );
        })}

        {/* Линия от заметки до курсора */}
        {linkingNoteId !== null && mousePosition && (
          <line
            x1={notes.find((note) => note.id === linkingNoteId)!.position.x + 100}
            y1={notes.find((note) => note.id === linkingNoteId)!.position.y + 10}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {/* Контекстное меню */}
      {contextMenu && (
        <div
          className="contextMenu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button onClick={() => startLinking(contextMenu.noteId)}>Связать</button>
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