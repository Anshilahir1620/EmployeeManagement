import React, { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import "../Admin/assets/css/UserHolidayPage.css";

export default function HolidayPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/2025/IN`
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const text = await res.text();
        if (!text) {
          throw new Error("Empty response from API");
        }

        const data = JSON.parse(text);

        const withMonth = data.map((h) => ({
          ...h,
          month: new Date(h.date).toLocaleString("default", { month: "long" }),
        }));

        setHolidays(withMonth);
      } catch (err) {
        console.error("Error fetching holidays:", err);

        // fallback dummy data
        setHolidays([
          { date: "2025-01-26", localName: "Republic Day", month: "January" },
          { date: "2025-08-15", localName: "Independence Day", month: "August" },
          { date: "2025-10-02", localName: "Gandhi Jayanti", month: "October" },
          { date: "2025-12-25", localName: "Christmas Day", month: "December" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // Group holidays by month
  const grouped = holidays.reduce((acc, holiday) => {
    if (!acc[holiday.month]) acc[holiday.month] = [];
    acc[holiday.month].push(holiday);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="holiday-page text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading holidays...</p>
      </div>
    );
  }

  return (
    <div className="holiday-page">
      <div className="hero-section">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">2025 Public Holidays</h1>
            <p className="hero-subtitle">
              Browse holidays month by month with live API data (fallback ready 🚀)
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {Object.keys(grouped).map((month) => (
          <div key={month} className="month-section mb-5">
            <h3 className="month-title">{month}</h3>
            <div className="holiday-grid">
              {grouped[month].map((holiday, idx) => (
                <Card
                  key={idx}
                  className="holiday-card shadow-sm fade-in"
                >
                  <Card.Body>
                    <Card.Title>
                      <FaCalendarAlt className="me-2 text-primary" />
                      {holiday.localName}
                    </Card.Title>
                    <Card.Text>Date: {holiday.date}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
