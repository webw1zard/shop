import { createClient } from '@/supabase/client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [draggedOrder, setDraggedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const [newOrder, setNewOrder] = useState({
    userId: '',
    location: '',
    phone: '',
    totalPrice: ''
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_product(*)')
        .order('created_at', { ascending: true });
      if (error) console.error(error);
      else setOrders(data);
    };

    fetchOrders();

    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDragStart = (order: any) => {
    setDraggedOrder(order);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (draggedOrder) {
      await supabase.from('orders').update({ status }).eq('id', draggedOrder.id);
      setDraggedOrder(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const addOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newOrder.userId || !newOrder.location || !newOrder.phone || !newOrder.totalPrice) {
      alert('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const { error } = await supabase.from('orders').insert([
      {
        userId: newOrder.userId,
        location: newOrder.location,
        phone: newOrder.phone,
        status: 'Open',
        totalPrice: newOrder.totalPrice,
      },
    ]);

    if (error) {
      console.error('Error adding order:', error);
    } else {
      setNewOrder({
        userId: '',
        location: '',
        phone: '',
        totalPrice: ''
      });
      setShowModal(false);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Orders</h1>
      <div className="text-center mb-4">
        <Button onClick={() => setShowModal(true)}>+ Add New Order</Button>
      </div>
      <Row>
        {['Open', 'InProgress', 'Close'].map((status) => (
          <Col key={status} md={4}>
            <h4 className="text-center">{status.toUpperCase()}</h4>
            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
              className="drop-zone p-2"
              style={{ minHeight: '300px', border: '2px dashed #ccc', borderRadius: '8px' }}
            >
              {orders
                .filter((order) => order.status === status)
                .map((order) => (
                  <Card
                    key={order.id}
                    className="mb-3"
                    draggable
                    onDragStart={() => handleDragStart(order)}
                  >
                    <Card.Body>
                      <Card.Title>{order.id.slice(0, 6)}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{order.userId}</Card.Subtitle>
                      <ul className="list-group list-group-flush">
                        {order.order_product.map((item: any) => (
                          <li key={item.id} className="list-group-item">
                            {item.product.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2">
                        Total: <strong>{order.totalPrice} UZS</strong>
                      </p>
                    </Card.Body>
                  </Card>
                ))}
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal: Order qo'shish */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addOrder}>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User ID"
                name="userId"
                value={newOrder.userId}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Location"
                name="location"
                value={newOrder.location}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone Number"
                name="phone"
                value={newOrder.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Total Price"
                name="totalPrice"
                value={newOrder.totalPrice}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Order
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
