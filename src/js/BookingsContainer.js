import React from 'react';
import Bookings from './Bookings';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Utils from './Utils';

dayjs.extend(isBetween);
/**
 * Container component
 */
class BookingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let
      bookings = [], 
      bookedProductsIDs = [],
      bookedProducts = [],
      bookedSellerIDs = [], bookedSellers = [];
    const apiUrl = 'https://blooming-fortress-38880.herokuapp.com';
    // get bookings
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((json) => {
        
        bookings = json.data;
        bookedProductsIDs = [...new Set(bookings.map(booking => booking.productId))]; // get unique Product ids that have been booked.
        return fetch(`${apiUrl}/products`);
      })
    // get products
      .then((response) => response.json())
      .then((json) => {
        const allProducts = json.data;
        bookedProducts = allProducts.filter((product) => bookedProductsIDs.includes(product.id)); // intersect between all products and products that been booked.
        bookedSellerIDs = [...new Set(bookedProducts.map(product => product.sellerId))]; //unque Sellers IDs
        return fetch(`${apiUrl}/sellers`)
      })
    // get sellers
      .then((response) => response.json())
      .then((json) => {
        const allSellers = json.data;
        bookedSellers = allSellers.filter((seller) => bookedSellerIDs.includes(seller.id)); // intersect

        // flattern bookings data with product and seller details
        const flatternBookings = bookings.map(booking => {
          const productID = booking.productId,
            bookedProduct = bookedProducts.find(product => {
              return product.id === productID;
            }),
            bookedSeller = bookedSellers.find(seller => {
              return seller.id === bookedProduct.sellerId
            }),
            isLive = dayjs().isBetween(dayjs(booking.startDate), dayjs(booking.endDate));
          return Object.assign(booking, { 'productName': bookedProduct.name, 'rate': bookedProduct.rate, 'sellerName': bookedSeller.name, isLive});
        });
        
        const today = dayjs();
        bookings = flatternBookings.reduce((accumulator, curBooking) => {
          if (!accumulator[curBooking.sellerName]) 
            accumulator[curBooking.sellerName] = []; // init
          if (dayjs(curBooking.endDate).isAfter(today)) {
            accumulator[curBooking.sellerName].push(curBooking);
          }
          return accumulator;
        }, {});
        this.setState({ 'bookings': bookings});
      })
      .catch(error => console.error('Error:', error));
  }

  handleKeyPress = Utils.debounce(searchString => {
    this.setState({ searchString });
  }, 200);

  

  render() {
    let tables = [];
    if (this.state.bookings) {
      let finalBookings = this.state.bookings;
      tables = Object.keys(finalBookings).map((sellerName) => {
        let bookings = finalBookings[sellerName];
        return <Bookings
          key={sellerName}
          sellerName={sellerName}
          bookings={bookings}
        />
      });
    }
      
    return (
      <>
        <header className="row no-gutters bookings-container__header">
          <div className="col">
            <h3 className="bookings-container__heading">Bookings</h3>
          </div>
          <div className="col text-right">
            <input type="text" placeholder="search for booking by product name" value={this.state.searchString || ''} onChange={e => { this.handleKeyPress(e.target.value)}} />
          </div>
          
        </header>
        {
          tables.length > 0 
          ? 
            tables.map(table => table)
          :
            <h5 className="text-center">Data is populating, please wait...</h5>
        }
      </>
    )
  }
}


export default BookingsContainer;