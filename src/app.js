// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import AdminDashboard from '../pages/dashboard-administrador/[userId]/[token]';
import Agenda from '../pages/Agenda/[userId]/[token]';
import Cadastro from '../pages/Cadastro-administrador';
import Influenciadores from '../pages/Influenciadores/[userId]/[token]';
import Projetos from '../pages/Projetos/[userId]/[token]';
import Metas from '../pages/Metas/[userId]/[token]';


const PrivateRoute = ({ Component, ...rest }) => {
    const { user } = React.useContext(AuthContext);

    return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<FormLogin />} />
                <Route path="/dashboard-administrador/:userId/:token" element={<PrivateRoute Component={AdminDashboard} />} />
                <Route path="/Agenda/:userId/:token" element={<PrivateRoute Component={Agenda} />} />
                <Route path="/Cadastro/:userId/:token" element={<PrivateRoute Component={Cadastro} />} />
                <Route path="/Influenciadores/:userId/:token" element={<PrivateRoute Component={Influenciadores} />} />
                <Route path="/Projetos/:userId/:token" element={<PrivateRoute Component={Projetos} />} />
                <Route path="/Metas/:userId/:token" element={<PrivateRoute Component={Metas} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
