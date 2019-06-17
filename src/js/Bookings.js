import React from 'react';
import Utils from './Utils';
import dayjs from 'dayjs';

/**
 * Prosentational component 
 * @param {*} props Seller name and a list of bookings
 */
const Bookings = (props) => {
  let sortedBookings = [];
  if (props.bookings.length > 0) {
    sortedBookings = props.bookings.sort((a, b) => {
      if (dayjs(a.startDate).isBefore(b.startDate))
        return -1;
      if (dayjs(a.startDate).isAfter(b.startDate))
        return 1;
      return 0;
    })
  }
  return (
    <div className="bookings">
      <h4>{props.sellerName}</h4>
      {
        props.bookings.length > 0
        ?
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {
                sortedBookings.map((booking) => {
                  return <BookingsRow
                    key={booking.id}
                    isLive={booking.isLive}
                    id={booking.id}
                    productName={booking.productName}
                    quantity={booking.quantity}
                    rate={booking.rate}
                    cost={booking.cost}
                  />
                })
              }
            </tbody>
          </table>
        :
        <div class="bookings__text"><p>No active bookings.</p></div>
      }
    </div>
  );
}

const BookingsRow = (props) => {
  const calcCost = (quantity, rate) => {
    return rate / 100 * quantity / 1000;
  }
  return (
    <tr className={props.isLive ? 'bookings__active-row' : ''}> 
      <td><strong>{props.id.substring(0, 5).toUpperCase()}</strong></td>
      <td>{props.productName}</td>
      <td>{Utils.formatNumber(props.quantity)}</td>
      <td>{Utils.formatCurrency(props.rate/100)}</td>
      <td>{Utils.formatCurrency(calcCost(props.quantity, props.rate))}</td>
    </tr>
  )
}




export default Bookings;

