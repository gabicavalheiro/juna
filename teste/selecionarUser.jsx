import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SelecionarUser() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('todos'); // Estado para armazenar o filtro selecionado

  useEffect(() => {
    // Função para carregar usuários baseado no filtro selecionado
    const fetchUsers = async () => {
      try {
        let url = 'http://localhost:3333/allUsers';

        if (filter === 'user' || filter === 'admin') {
          url = `http://localhost:3333/allUsers/${filter}`;
        }

        const response = await axios.get(url);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    fetchUsers();
  }, [filter]); // Atualiza a lista de usuários quando o filtro muda

  const handleUserChange = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3333/allUsers/${userId}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos do usuário:', error);
      setEvents([]); // Define um array vazio em caso de erro
    }
  };

  return (
    <div>
      <h1>Selecionar Usuário</h1>
      <select onChange={(e) => {
        const userId = parseInt(e.target.value, 10);
        setSelectedUser(users.find(user => user.id === userId));
        handleUserChange(userId);
      }}>
        <option value="">Selecione um usuário</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.nome} ({user.role})
          </option>
        ))}
      </select>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="user">Usuários</option>
        <option value="admin">Administradores</option>
      </select>

      {selectedUser && (
        <div>
          <h2>Eventos de {selectedUser.nome}</h2>
          <ul>
            {events.map((item) => (
              <li key={item.id}>
                {item.eventDate} - {item.description} ({item.tag} - {item.time})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
