import React from 'react';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import './Card.css';

const Card = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="card" style={{ borderLeftColor: color }}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon />
        </div>
        <div className="card-title">{title}</div>
      </div>
      <div className="card-value">{value}</div>
      {trend && (
        <div className="card-trend">
          {trend.type === 'up' ? (
            <HiOutlineTrendingUp className={`trend-icon trend-up`} />
          ) : (
            <HiOutlineTrendingDown className={`trend-icon trend-down`} />
          )}
          <span className={`trend-value trend-${trend.type}`}>
            {trend.value}%
          </span>
          <span className="trend-label"> vs o'tgan oy</span>
        </div>
      )}
    </div>
  );
};

export default Card;