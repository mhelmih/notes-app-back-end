const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, createdAt, updatedAt, tags, body,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  }).code(500);
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note) {
    return h.response({
      status: 'success',
      data: {
        note,
      },
    });
  }

  return h.response({
    status: 'error',
    message: 'Catatan tidak ditemukan',
  }).code(404);
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const idx = notes.findIndex((n) => n.id === id);

  if (idx === -1) {
    return h.response({
      status: 'error',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    }).code(404);
  }

  notes[idx] = {
    ...notes[idx],
    title,
    tags,
    body,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  }).code(200);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const idx = notes.findIndex((n) => n.id === id);

  if (idx === -1) {
    return h.response({
      status: 'error',
      message: 'Gagal menghapus catatan. Id tidak ditemukan',
    }).code(404);
  }

  notes.splice(idx, 1);
  return h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  }).code(200);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
