import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Container,
  Button,
  FormControl,
} from "react-bootstrap";
import "./css/TableCard.css";
import { toast } from "react-toastify";
function TableCard({ data }) {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countryName, setCountryName] = useState();
  const [countryId, setCountryId] = useState();
  const [prevCountryId, setPrevCountryId] = useState();
  const [status, setStatus] = useState();
  const [id, setId] = useState();

  const editCountry = (d) => {
    setPrevCountryId(d.country_id);
    setCountryName(d.country_name);
    setCountryId(d.country_id);
    setStatus(d.status);
    setId(d.id);
  };

  const deleteCountry = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/superadmin/deletecountry/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );
    const result = await res;
    if (result.status == 200) {
      toast.success("Country Deleted Successfully!", { theme: "dark" });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countryName.length >= 30 || countryName.length == 0) {
      toast.warning("Enter Valid Country Name", { theme: "dark" });
    } else if (countryId.length > 3) {
      toast.warning("Enter 3 Characters Currency Code", { theme: "dark" });
    } else {
      console.log(checkedItems.undefined);

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/superadmin/editcountry/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country_id: countryId,
            country_name: countryName,
            status: checkedItems.undefined,
            prev_country: prevCountryId,
            id: id,
          }),
        }
      );
      const result = await res;
      if (result.status == 200) {
        toast.success("Country Edited Successfully!", { theme: "dark" });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  const handleCheckboxChange = async (event, id, country_id) => {
    const isChecked = event.target.checked;

    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/superadmin/countrystatus/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: isChecked,
          country_id: country_id,
        }),
      }
    );
    const result = await res;
    if (result.status == 200) {
      toast.success("Status Updated!", { theme: "dark" });
    } else {
      toast.warning("Error! Cannot update status :(", { theme: "dark" });
    }
  };

  return (
    <div className="col-span-full bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Country Currency Data</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table Header */}
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">
                  <div className="font-semibold text-left">Country Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Country Currency Code
                  </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Status</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Edit/Delete</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {/* Row */}
              {data.length === 0 ? (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="p-2 text-center text-red-700 text-bold">
                      Data doesn't exist
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((d, id) => (
                  <tr className="table-data" key={id}>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="text-slate-800">{id + 1}</div>
                      </div>
                    </td>
                    <td
                      className="p-2"
                      onClick={() => {
                        navigate(`/country-comparision`, {
                          state: { data: d },
                        });
                      }}
                    >
                      <div className="text-left text-sky-500 country-name">
                        {d.country_name}
                      </div>
                    </td>
                    <td className="p-2 text-center text-green-500">
                      {d.country_id}
                    </td>
                    <td className="p-2 text-center">
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={d.status}
                          onChange={(event) =>
                            handleCheckboxChange(event, d.id, d.country_id)
                          }
                        />
                        <div className="slider"></div>
                        <div className="slider-card">
                          <div className="slider-card-face slider-card-front"></div>
                          <div className="slider-card-face slider-card-back"></div>
                        </div>
                      </label>
                    </td>
                    <td
                      style={{ display: "flex", justifyContent: "center" }}
                      className="p-2 text-right"
                    >
                      <button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={() => {
                          setIsModalOpen(true);
                          editCountry(d);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pen"
                          viewBox="0 0 16 16"
                        >
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                      </button>
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
                                  <Form onSubmit={handleSubmit} className="p-5">
                                    <Form.Group as={Col}>
                                      <Form.Label>
                                        Enter Country Name
                                      </Form.Label>
                                      <Form.Control
                                        name="country_name"
                                        type="text"
                                        defaultValue={countryName}
                                        onChange={(e) =>
                                          setCountryName(e.target.value)
                                        }
                                        placeholder="e.g. India"
                                        required
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                      <Form.Label>
                                        Enter Country Currency ID*
                                      </Form.Label>
                                      <Form.Control
                                        name="currency_id"
                                        type="text"
                                        value={countryId}
                                        onChange={(e) =>
                                          setCountryId(e.target.value)
                                        }
                                        placeholder="e.g. INR"
                                        required
                                      />
                                    </Form.Group>
                                    <Button
                                      className="mb-8 savebtn"
                                      type="submit"
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

                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => {
                          deleteCountry(d.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableCard;
