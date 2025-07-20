import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading tickets...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Your Support Tickets</h2>
      <Link to="/submit-ticket" style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        display: 'inline-block',
        marginBottom: '20px'
      }}>Submit New Ticket</Link>
      {tickets.length === 0 ? (
        <p>You have no support tickets.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tickets.map((ticket) => (
            <li key={ticket.id} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '15px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>Subject: {ticket.subject}</strong>
                <span>Ticket ID: {ticket.id}</span>
                <span>Status: {ticket.status}</span>
              </div>
              <p>{ticket.description}</p>
              <p style={{ fontSize: '0.8em', color: '#777' }}>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;