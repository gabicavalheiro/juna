import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    // Função para carregar todos os usuários
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/allUsers');
        setUsers(response.data);  // Assume que a API retorna um array de usuários
        setFilteredUsers(response.data);  // Inicialmente, exibe todos os usuários
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  // Função para filtrar usuários pelo role
  const handleFilterChange = async (e) => {
    const selectedRole = e.target.value;

    try {
      if (selectedRole === 'all') {
        setFilteredUsers(users);  // Exibe todos os usuários
      } else {
        const response = await axios.get(`/allUsers/${selectedRole}`);
        setFilteredUsers(response.data);  // Exibe usuários filtrados pelo role
      }
      setRoleFilter(selectedRole);
    } catch (error) {
      console.error('Erro ao filtrar usuários por role:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <div>
        <label htmlFor="roleFilter">Filtrar por Role:</label>
        <select id="roleFilter" value={roleFilter} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="admin">Administradores</option>
          <option value="user">Usuários</option>
        </select>
      </div>
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            <strong>{user.nome}</strong> ({user.email}) - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
