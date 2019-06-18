import React from 'react';
import Utils from './Utils';
import dayjs from 'dayjs';
import { FilterContext } from './FilterContext';


/**
 * Prosentational component 
 * @param {*} props Seller name and a list of bookings
 */
class Bookings extends React.Component {
  static contextType = FilterContext
  constructor(props) {
    super(props);
  }

  render() {
    let processedBookings = [];
    // Sorting by start Date
    if (this.props.bookings.length > 0) {
      processedBookings = this.props.bookings.sort((a, b) => {
        if (dayjs(a.startDate).isBefore(b.startDate))
          return -1;
        if (dayjs(a.startDate).isAfter(b.startDate))
          return 1;
        return 0;
      })
    }

    const searchOn = Utils.sanitiseString(this.context.searchString);
    if (searchOn.length> 0) {
      if (searchOn.length <= 3) {
        processedBookings = processedBookings.filter((booking) => {
          const curProductName = Utils.sanitiseString(booking.productName);
          return curProductName.startsWith(searchOn);
        });
      } else {
        
      }
      processedBookings = processedBookings.filter((booking) => {
        const curProductName = Utils.sanitiseString(booking.productName);
        if (searchOn.length <= 3) {
          return curProductName.startsWith(searchOn);
        } else {
          const regex = new RegExp(searchOn, "g");
          return curProductName.match(regex);
        }
        
      });
    }
    // Filter by input field
    return (
      <div className="bookings">
        <h4>{this.props.sellerName}</h4>
        {
          processedBookings.length > 0
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
                  processedBookings.map((booking) => {
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
            searchOn.length > 0 
            ?
              <div className="bookings__text"><p>No bookings match your search term '{this.context.searchString}'.</p></div>
            : 
              <div className="bookings__text"><p>No active bookings.</p></div>
        }
      </div>
    );
  }
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

