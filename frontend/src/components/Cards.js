import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Cardsdata from './CardsData';
import './style.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { ADD } from '../redux/actions/action'
import { alanAtom, command, value } from "../../src/alanAtom"
import alanBtn from "@alan-ai/alan-sdk-web";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, NavLink } from 'react-router-dom';
import { useAtom } from 'jotai';

const Cards = () => {


  const [message, setMessage] = useAtom(command);
  const [newAlanAtom, setAlanAtom] = useAtom(alanAtom);
  const [newValue, setValue] = useAtom(value);


  const [data, setData] = useState(Cardsdata);
  const [cardData, setCardData] = useState([]);


  useEffect(() => {

    if (message == 'menu') {
      for (let i = 0; i < cardData.length; i++) {

        if (newAlanAtom) {
          newAlanAtom.playText(`${cardData[i].dish}` + 'price is' + `${cardData[i].price}`)
        }

      }
    } else if (message == 'noodles') {
      window.open(`http://localhost:3000/order/64d3c78880485394970aba0d`)
    } else if(message == 'order_burger'){
      window.open(`http://localhost:3000/order/64d3c75180485394970aba0b`)
    }


  }, [message])


  const dispatch = useDispatch()

  const send = (e) => {
    dispatch(ADD(e));
    console.log(e)
  }

  const generatePDF = () => {
    const doc = new jsPDF();

    const text = "Today Menu";
    const textWidth = doc.getTextWidth(text);
    const x = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, x, 10);

    // Define styles for the table.
    const styles = {
      font: 'helvetica',
      fontSize: 12,
      textColor: [0, 0, 0],
      cellPadding: 5,
      rowHeight: 20,

      tableWidth: 'auto',
      // 'auto' will automatically adjust the table width based on content.
    };

    doc.autoTable({
      head: [['Resturant', 'Price', 'Dish', 'Rating', 'Quantity', 'Review']],
      body: cardData.map((dcardData) => [
        dcardData.resturant,
        dcardData.price,
        dcardData.dish,
        dcardData.rating,
        dcardData.qnty,
        dcardData.review,
      ]),
      startY: 50,
      styles: styles,
    });

    doc.save('file_report.pdf');
  };

  const sendRequest = async () => {
    const res = await axios.get("http://localhost:5000/cart/").catch((err) => console.log(err))
    const data = await res.data;
    return data;
  }

  useEffect(() => {
    sendRequest().then((data) => setCardData(data))

  }, [cardData])

  //  useEffect(() => {
  //   const alanInstance = alanBtn({
  //     key: '443debc3a9e2807fec25a5ebc34ae21b2e956eca572e1d8b807a3e2338fdd0dc/stage',
  //     onCommand: ({ command, cardData, number }) => {
  //       if (command === 'testCommand') {
  //            //sendRequest().then((data) => setCardData(data))
  //       } else if (command === 'highlight') {
  //         //setactivearticl((prevArtical) => prevArtical + 1)
  //       } else if (command === 'noodles') {
  //         window.open(`http://localhost:3000/order/64d3c78880485394970aba0d`)
  //       }else if(command === 'order_burger'){
  //         window.open(`http://localhost:3000/order/64d3c75180485394970aba0b`)
  //       }else if(command === 'play'){
  //            alanInstance.playText('Hi')
  //       }
  //     }
  //   });

  // }, [])


  const deletequotation = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/cart/delete/${id}`);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='container mt-3'>
      <h2 className='text-center'>Today Menu</h2>
      <div className='searchcomponent'>
        <input type='text' placeholder='Seacrh any food here' className='search' />
        <button name='Search' value="Search" style={{ backgroundColor: '#1a75ff' }} className='btnsearch'>Search</button>
        <Link to="/addnew">
          <Button name='Add product' className='addbtn'>+ Add Product</Button>
        </Link>
      </div>
      <div style={{ position: 'absolute', top: '112px', display: 'flex', marginLeft: '-80px' }}>
        <Button variant='success' onClick={generatePDF} style={{ backgroundColor: 'green', margin: '20px' }}>Generate report</Button>
      </div>


      <div className='ct'>
        {
          cardData.map((element, id) => {
            return (
              <>
                <Card className='bh' style={{ width: '18rem', mt: '40px', border: 'none' }}  >
                  <Card.Img variant="top" src={element.image} style={{ height: "15rem" }} />
                  <div style={{ marginLeft: '20px', position: 'absolute', top: '10px', marginLeft: '245px', backgroundColor: 'none' }}>
                    <Dropdown >
                      <Dropdown.Toggle variant='light' className='action' id="dropdown-basic">
                      </Dropdown.Toggle>
                      <Dropdown.Menu>

                        <Dropdown.Item>
                          <NavLink to={`view/${element._id}`} className="text-decoration-none">
                            <RemoveRedEyeIcon style={{ color: "green " }}></RemoveRedEyeIcon><span>View</span>
                          </NavLink>
                        </Dropdown.Item>

                        <Dropdown.Item >
                          <NavLink to={`update/${element._id}`} className="text-decoration-none">
                            <ModeEditIcon style={{ color: "#9900cc" }}></ModeEditIcon><span>Update</span>
                          </NavLink>
                        </Dropdown.Item>
                        <Dropdown.Item >
                          <div onClick={() => { deletequotation(element._id); toast.error("successfully deleted the product") }} >
                            <DeleteIcon style={{ color: "red" }}></DeleteIcon><span>Delete</span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <Card.Body>
                    <Card.Title>{element.dish}</Card.Title>
                    <Card.Text style={{ fontSize: '17px', fontWeight: '2rem' }}>
                      Price : Rs.{element.price}
                    </Card.Text>
                    <Button variant="primary" style={{ backgroundColor: '#1a75ff' }} onClick={() => { send(element); toast.success("successfully added to cart") }} >
                      Add to Cart</Button>
                    <Button variant="primary" style={{ marginLeft: '55px', backgroundColor: '#1a1aff', border: 'none' }} href={`order/${element._id}`} >
                      Buy Now</Button>
                    <ToastContainer position="bottom-center" autoClose={400} />
                  </Card.Body>
                </Card>
              </>
            )
          })
        }
      </div>
    </div>
  )
}

export default Cards
