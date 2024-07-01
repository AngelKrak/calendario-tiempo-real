import React, { memo, useState } from 'react';

const EditNameModal = ({ name, updateName, closeModal }) => {
  const [newName, setNewName] = useState(name.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateName({ ...name, name: newName });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Nombre</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div className="flex justify-end">
            <button type="button" onClick={closeModal} className="mr-4">
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EditNameModal);
