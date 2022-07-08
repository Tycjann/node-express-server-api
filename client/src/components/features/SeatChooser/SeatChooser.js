import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, loadSeatsRequest, getRequests, loadSeats } from '../../../redux/seatsRedux';
import './SeatChooser.scss';

import io from 'socket.io-client';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const allSeats = 50;
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState();

  useEffect(() => {
    const SERVER_URL = (process.env.NODE_ENV === 'production') ? '' : 'http://localhost:8000';
    const socket = io(SERVER_URL);

    socket.on('seatsUpdated', (seats) => {
      dispatch(loadSeats(seats));
      // console.log(seats);
    });
    
    setSocket(socket);

    return () => socket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSocket]);
  
  useEffect(() => {
    dispatch(loadSeatsRequest());
  }, [dispatch])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(loadSeatsRequest());
  //   }, 20000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  const countNoFreeSeats = () => {
    const noFreeSeats = seats.filter((seat) => seat.day === chosenDay);
    if (noFreeSeats) {
      return noFreeSeats.length;
    }
  }

  const isTaken = (seatId) => {
    return (seats.some(item => (item.seat === seatId && item.day === chosenDay)));
  }

  const prepareSeat = (seatId) => {
    if(seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if(isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2"><Button color="secondary" /> – seat is already taken</small>
      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4"><Button outline color="primary" /> – it's empty</small>
      {(requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success) && <div className="seats">{[...Array(allSeats)].map((x, i) => prepareSeat(i+1) )}</div>}
      {(requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending) && <Progress animated color="primary" value={allSeats} /> }
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error) && <Alert color="warning">Couldn't load seats...</Alert> }
      <p>Free seats: {countNoFreeSeats()}/{allSeats}</p>
    </div>
  )
}

export default SeatChooser;