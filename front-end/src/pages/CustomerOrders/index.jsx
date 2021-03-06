import React, { useState, useEffect, useContext } from 'react';
import Context from '../../context/Context';
import OrderCard from '../../components/OrderCard';
import api from '../../api/index';
import './style.css';
import NavBar from '../../components/NavBar';
import socketClient from '../../helpers/socketClient';

function CustomerOrders() {
  const { userData } = useContext(Context);

  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data: sales } = await api.getSalesByUser(userData.id, userData.role);
      setOrders(sales);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
    socketClient.on('updateStatus', () => {
      getOrders();
    });
    return () => {
      socketClient.removeListener('updateStatu');
      socketClient.removeAllListeners('updateStatus');
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="Orders">
      <NavBar />
      <h1 className="title">Meu Pedidos</h1>
      <main className="CatalogOrdes">
        {
          orders.map((order) => (
            <OrderCard key={ order.id } order={ order } />
          ))
        }
      </main>
    </div>
  );
}

export default CustomerOrders;
