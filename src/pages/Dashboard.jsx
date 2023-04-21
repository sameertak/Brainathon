import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import "./css/Dashboard.css";
import { useNavigate } from "react-router-dom";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import TableCard from "../partials/dashboard/TableCard";
import { toast } from "react-toastify";
import { Col, Form, Pagination, Row, Container, Button } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [global, setGlobal] = useState([]);
  const [total, setTotal] = useState("");
  const [pg, setPg] = useState(1);
  const [ini, setIni] = useState("");
  const [countryId, setCountryId] = useState();
  const [countryName, setCountryName] = useState();
  const [toId, setToId] = useState();
  const [rates, setRates] = useState();

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (pg) => {
    if (
      localStorage.getItem("access") === null ||
      localStorage.getItem("access") === undefined
    ) {
      toast.info("Session Expired!\nLogin First!!", { theme: "dark" });
      return navigate("/login");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    };

    const id = toast.loading("Fetching Data...", {
      theme: "dark",
      closeOnClick: true,
      closeButton: null,
      toastId: "duplicate",
    });

    console.log(pg);
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/superadmin/countries/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pg,
        }),
      }
    );
    const result = await res.json();
    setFeedbacks(result.data);
    setGlobal(result.data);
    setTotal(result.count);
    setIni(result.count);
    toast.update(id, {
      isLoading: false,
      render: "Fetched",
      type: "success",
      autoClose: 1000,
      toastId: id,
    });
  };

  const addCountry = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/superadmin/addcountry/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country_id: countryId,
          country_name: countryName,
          to_id: toId,
          rates: rates,
        }),
      }
    );
    window.location.reload();
  };

  const downloadData = async () => {
    window.open(
      `${import.meta.env.VITE_BASE_URL}/superadmin/country/data/`,
      "_blank"
    );
  };

  let items = [];
  for (let number = 1; number <= Math.ceil(total / 10); number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === pg}
        onClick={() => {
          setPg(number);
          fetchData(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="mb-8">
              <div className="">
                {/* <Form> */}
                <Row>
                  <Form.Group as={Col} xs={12} md={9}>
                    <button
                      className="bg-green-600 mb-2 hover:bg-green-700 text-white font-bold py-1 px-3 mx-2 rounded"
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      Add New Country
                    </button>
                  </Form.Group>
                  <Col className="">
                    <button
                      className="bg-gray-300  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-md-end"
                      onClick={downloadData}
                    >
                      <svg
                        className="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </Col>
                </Row>
                {/* </Form> */}
              </div>
            </div>
            {isModalOpen && (
              <div className="modal-container">
                <div
                  className="modal-background"
                  onClick={() => setIsModalOpen(false)}
                ></div>
                <div className="modal-content">
                  {/* Add form for editing data here */}
                  <Container className="mt-3">
                    <Row>
                      <Col>
                        <Form className="p-5 formdata">
                          <Form.Group as={Col}>
                            <Form.Label>Enter Country Name*</Form.Label>
                            <Form.Control
                              name="country_name"
                              type="text"
                              onChange={(e) => setCountryName(e.target.value)}
                              placeholder="e.g. India"
                              required
                            />
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>
                              Enter Country Currency ID 1*
                            </Form.Label>
                            <Form.Control
                              name="currency_id"
                              type="text"
                              value={countryId}
                              onChange={(e) => setCountryId(e.target.value)}
                              placeholder="e.g. INR"
                              required
                            />
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>
                              Enter Country Currency ID 2*
                            </Form.Label>
                            <Form.Control
                              name="currency_id2"
                              type="text"
                              value={toId}
                              onChange={(e) => setToId(e.target.value)}
                              placeholder="e.g. INR"
                              required
                            />
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>Rates*</Form.Label>
                            <Form.Control
                              name="rates"
                              type="text"
                              value={rates}
                              onChange={(e) => setRates(e.target.value)}
                              placeholder="e.g. 0.506"
                              required
                            />
                          </Form.Group>
                          <Button
                            onClick={addCountry}
                            type="submit"
                            className="savebtn"
                            variant="primary"
                          >
                            Save Changes
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Container>
                  <button
                    type="button"
                    className="btn btn-danger close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-12 gap-6">
              {/* Table (Top Channels) */}
              <TableCard data={feedbacks} />
              <Pagination className="col-span-full mx-auto" size="sm">
                {items}
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
