import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Simple icons for demonstration purposes
const CheckCircleIcon = () => <svg className="order-success-icon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const StatusStepIcon = ({ step, active }) => <div className={`status-icon ${active ? 'active' : ''}`}>{step}</div>;


const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  const [status, setStatus] = useState('Order Confirmed');
  const statusSteps = ['Order Confirmed', 'Food Being Prepared', 'On the Way', 'Delivered'];
  const currentStatusIndex = statusSteps.indexOf(status);

  useEffect(() => {
    if (currentStatusIndex < statusSteps.length - 1) {
      const timer = setTimeout(() => {
        setStatus(statusSteps[currentStatusIndex + 1]);
      }, 10000); // Update every 10 seconds for demo
      return () => clearTimeout(timer);
    }
  }, [currentStatusIndex, statusSteps]);

  if (!order) {
    return (
      <div className="order-confirmation-container fallback">
        <h2>Order not found</h2>
        <p>There was an issue retrieving your order details.</p>
        <Link to="/" className="btn btn-primary" style={{marginTop: 24}}>Go to Homepage</Link>
      </div>
    );
  }

  const progressPercentage = (currentStatusIndex / (statusSteps.length - 1)) * 100;

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-card fade-in">
        <CheckCircleIcon />
        <h1 className="order-success-message">Order Placed!</h1>
        <p className="order-sub-message">Thank you! Your order is being processed.</p>

        <div className="order-status-tracker">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="status-steps">
            {statusSteps.map((step, index) => (
              <div key={step} className={`status-step ${index <= currentStatusIndex ? 'active' : ''}`}>
                <StatusStepIcon step={index + 1} active={index <= currentStatusIndex} />
                <p className="status-name">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="eta-section">
          <h2 className="eta-title">Estimated Delivery</h2>
          <p className="eta-time">25-30 mins</p>
        </div>

        <div className="order-summary-section">
          <h3 className="order-summary-title">Order Summary</h3>
          <div className="summary-details">
            <div className="summary-item">
              <strong>Order ID:</strong>
              <span>#{order._id.slice(-6)}</span>
            </div>
            <div className="summary-item">
              <strong>Restaurant:</strong>
              <span>{order.restaurantName}</span>
            </div>
            <div className="summary-item">
              <strong>Total Paid:</strong>
              <span>₹{order.total}</span>
            </div>
            <div className="summary-item">
              <strong>Deliver To:</strong>
              <span>{order.address}</span>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
