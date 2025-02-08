import React, { useEffect, useRef, useState } from "react";
import { Heading, Input, Select } from "@chakra-ui/react";
import { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CUSTOMERS_ENDPOINT } from "../data/constants";
import useCustomer from "../hooks/useCustomer";
import APIClient from "../services/api-client";
import Customer from "../entities/Customer";
import { useCountries } from "../hooks/useCountries";
import CountrySelector from "../components/CountrySelector";
import { CustomerUpdateFormData } from "../types/forms";

const customerApiClient = new APIClient<Customer, CustomerUpdateFormData>(
  CUSTOMERS_ENDPOINT
);

const EditProfile = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  // Decode token and extract user ID
  const userToken = localStorage.getItem("token");
  let userId: string | null = null;

  if (userToken) {
    const decodedToken: { _id: string } = jwtDecode(userToken);
    userId = decodedToken._id;
  }

  // Fetch the customer
  const { data: customer, error, isLoading } = useCustomer(userId!);

  const { countries: filteredCountries, setFilter } = useCountries();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (customer) {
      setCountry(customer.country || "");
      setPhone(customer.phone_number || "");
    }
    if (error) {
      setErrMsg("Error fetching customer details.");
    }
  }, [customer, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!customer?._id) return; // Type guard to check if _id exists

      await customerApiClient.put(customer._id, {
        country: country || customer.country,
        phone_number: phone || customer.phone_number,
      });

      alert("Profile updated successfully.");

      navigate(`/users/${customer._id}`);

      // setErrMsg("Profile updated successfully.");
    } catch (error) {
      const err = error as AxiosError;
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Error updating profile.");
      }
      errRef.current?.focus();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!customer) return <p>No customer profile found.</p>;

  return (
    <>
      <section className="login-container">
        <form onSubmit={handleSubmit} className="login-form" role="form">
          {errMsg && (
            <p ref={errRef} className="errmsg" aria-live="assertive">
              {errMsg}
            </p>
          )}

          <Heading as="h1">Edit Profile</Heading>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <CountrySelector
              selectedCountry={country}
              onSelect={(countryCode) => setCountry(countryCode)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              className="form-control"
              type="text"
              id="phone"
              name="phone"
              ref={phoneRef}
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              placeholder="Enter phone number..."
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate(`/users/${customer?._id}`)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProfile;
