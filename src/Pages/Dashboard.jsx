import { useState, useEffect, useRef } from "react";
import {
  Card,
  Badge,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "../assets/css/Dashboard.css";
import { BsPeople } from "react-icons/bs";
import {
  MdAttachMoney,
  MdFitnessCenter,
  MdRestaurantMenu,
  MdCalendarToday,
  MdFileDownload,
} from "react-icons/md";
// import { BASEURL } from "../common/Gloable.jsx";
import { useNavigate } from 'react-router-dom';

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_users_count: 0,
    total_workout_count: 0,
    total_meals_count: 0,
    total_subscriptions_amount: 0,
    recent_activities: [],
    meal_workout_data: [], // Add this for the meal/workout chart data
    // New chart data from API
    user_activity_chart: [],
    workout_progress_chart: [],
    nutrition_chart: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();
  // Initialize date range state with simple date objects
  const [dateRange, setDateRange] = useState(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7); // Default to 7 days ago
    return {
      startDate: fromDate,
      endDate: toDate,
    };
  });
  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Dashboard Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      // Date Range
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Date Range: ${formatDateRange()}`, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 20;

      // Key Metrics Section
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Key Metrics", 20, yPosition);
      yPosition += 10;

      const metrics = [
        {
          label: "Total Users",
          value: dashboardData.total_users_count.toLocaleString(),
        },
        {
          label: "Total Workouts",
          value: dashboardData.total_workout_count.toLocaleString(),
        },
        {
          label: "Meal Plans",
          value: dashboardData.total_meals_count.toLocaleString(),
        },
        {
          label: "Subscriptions Revenue",
          value: `$${dashboardData.total_subscriptions_amount.toLocaleString()}`,
        },
      ];

      pdf.setFontSize(12);
      metrics.forEach((metric, index) => {
        const xPos = 20 + (index % 2) * 90;
        const yPos = yPosition + Math.floor(index / 2) * 15;
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${metric.label}:`, xPos, yPos);
        pdf.setTextColor(40, 40, 40);
        pdf.text(metric.value, xPos + 60, yPos);
      });
      yPosition += 40;

      // Charts & Analytics
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Charts & Analytics", 20, yPosition);
      yPosition += 15;

      const chartElements = document.querySelectorAll(".chart-card");

      for (let i = 0; i < chartElements.length; i++) {
        const element = chartElements[i];

        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 20;
        }

        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            width: element.offsetWidth,
            height: element.offsetHeight,
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const chartTitle =
            element.querySelector(".chart-title")?.textContent ||
            `Chart ${i + 1}`;
          pdf.setFontSize(14);
          pdf.setTextColor(60, 60, 60);
          pdf.text(chartTitle, 20, yPosition);
          yPosition += 10;

          pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.error("Error capturing chart:", error);
          pdf.setFontSize(12);
          pdf.setTextColor(150, 150, 150);
          pdf.text("Chart could not be captured", 20, yPosition);
          yPosition += 20;
        }
      }

      // Meal & Workout Table
      if (dashboardData.meal_workout_data?.length > 0) {
        const rowHeight = 10;

        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Meal & Workout Data", 20, yPosition);
        yPosition += 12;

        // Table Headers
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255); // White text
        pdf.setFillColor(255, 0, 0); // 🔴 Red background
        pdf.rect(20, yPosition - 6, pageWidth - 40, rowHeight, "F");
        pdf.text("Month", 25, yPosition);
        pdf.text("Workouts", 95, yPosition);
        pdf.text("Meals", 150, yPosition);
        yPosition += rowHeight;

        // Table Rows
        pdf.setTextColor(40, 40, 40);
        dashboardData.meal_workout_data.forEach((item) => {
          if (yPosition + rowHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.text(item.month_name, 25, yPosition);
          pdf.text(item.workout_count.toString(), 95, yPosition);
          pdf.text(item.meal_log_count.toString(), 150, yPosition);
          yPosition += rowHeight;
        });
      }

      // Footer
      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on ${currentDate}`, 20, pageHeight - 10);
      pdf.text("Dashboard Report", pageWidth - 20, pageHeight - 10, {
        align: "right",
      });

      pdf.save(`dashboard-report-${formatDateForAPI(new Date())}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const admindashboardcounters = async () => {
    const StoredData = localStorage.getItem("authUser");
    if (!StoredData) {
      toast.error("Authentication required");
      return;
    }

    const Token = JSON.parse(StoredData);
    setIsLoading(true);

    const payload = {
      from_dt: formatDateForAPI(dateRange.startDate),
      to_dt: formatDateForAPI(dateRange.endDate),
      per_page: "10",
      with_pagination: "1",
      include_charts: "1", // Add this parameter to request chart data
    };

    console.log("API Payload:", payload);

    try {
      const response = await fetch(`${BASEURL}/admindashboardcounters`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Token.access_token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log("API Response:", responseJson);

      if (responseJson.result) {
        // Update dashboard data with API response
        setDashboardData({
          total_users_count: responseJson.data.total_users_count || 0,
          total_workout_count: responseJson.data.total_workout_count || 0,
          total_meals_count: responseJson.data.total_meals_count || 0,
          total_subscriptions_amount:
            responseJson.data.total_subscriptions_amount || 0,
          recent_activities: responseJson.data.recent_activities || [],
          meal_workout_data: responseJson.data.meal_workout_data || [], // Add this line
          // Chart data from API (fallback to empty arrays if not provided)
          user_activity_chart: responseJson.data.user_activity_chart || [],
          workout_progress_chart:
            responseJson.data.workout_progress_chart || [],
          nutrition_chart: responseJson.data.nutrition_chart || [],
        });
        // toast.success(responseJson.message);
      } else {
        toast.warning(responseJson.message);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    admindashboardcounters();
  }, [dateRange]);

  // Transform meal_workout_data for the chart
  const getMealWorkoutChartData = () => {
    if (
      dashboardData.meal_workout_data &&
      dashboardData.meal_workout_data.length > 0
    ) {
      return dashboardData.meal_workout_data.map((item) => ({
        month: item.month_name,
        workout_count: parseInt(item.workout_count) || 0,
        meal_log_count: parseInt(item.meal_log_count) || 0,
      }));
    }
    // Fallback data if no API data
    return [
      { month: "April", workout_count: 3, meal_log_count: 10 },
      { month: "May", workout_count: 5, meal_log_count: 3 },
      { month: "June", workout_count: 0, meal_log_count: 2 },
    ];
  };

  // Fallback data for other charts when API doesn't return chart data
  const fallbackWorkoutProgressData = [
    { day: "Mon", cardio: 4, strength: 6 },
    { day: "Tue", cardio: 5, strength: 4 },
    { day: "Wed", cardio: 3, strength: 7 },
    { day: "Thu", cardio: 6, strength: 3 },
    { day: "Fri", cardio: 4, strength: 8 },
    { day: "Sat", cardio: 8, strength: 2 },
    { day: "Sun", cardio: 5, strength: 4 },
  ];

  const fallbackNutritionData = [
    { name: "Carbs", value: 40, color: "#3B82F6" },
    { name: "Protein", value: 30, color: "#F59E0B" },
    { name: "Fat", value: 20, color: "#EF4444" },
    { name: "Other", value: 10, color: "#E5E7EB" },
  ];

  // Use API data if available, otherwise use fallback data
  const mealWorkoutChartData = getMealWorkoutChartData();

  const workoutProgressData =
    dashboardData.workout_progress_chart.length > 0
      ? dashboardData.workout_progress_chart
      : fallbackWorkoutProgressData;

  const nutritionData =
    dashboardData.nutrition_chart.length > 0
      ? dashboardData.nutrition_chart
      : fallbackNutritionData;

  // Helper to get color for activity type badge
  const getTypeColor = (type) => {
    switch (type) {
      case "workout":
        return "#8B5CF6";
      case "meal":
        return "#10B981";
      case "achievement":
        return "#F59E0B";
      case "subscription":
        return "#3B82F6";
      case "support_chat":
        return "#EF4444";
      case "feedback":
        return "#6366F1";
      default:
        return "#6B7280";
    }
  };

  const getActivityType = (type) => {
    switch (type) {
      case "support_chat":
        return "Support";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Format a date string as "time ago" (e.g., "2 days ago", "3 hours ago", "Just now")
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffMs = now - activityDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Get initials from a name string (e.g., "John Doe" => "JD")
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format a JS Date object as "YYYY-MM-DD" for API usage
  const formatDateForAPI = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: new Date(value),
    }));
  };

  const formatDateRange = () => {
    return `${formatDateForDisplay(
      dateRange.startDate
    )} - ${formatDateForDisplay(dateRange.endDate)}`;
  };

  // Predefined date range options
  const applyPresetRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();

    if (days === 0) {
      // Today
      setDateRange({
        startDate: new Date(endDate),
        endDate: new Date(endDate),
      });
    } else if (days === 1) {
      // Yesterday
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      setDateRange({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else {
      // Last N days
      startDate.setDate(startDate.getDate() - days);
      setDateRange({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }
    setShowDatePicker(false);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h4 className="dashboard-title">Dashboard</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={downloadPDF}
            disabled={isGeneratingPDF || isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #dc3545", // red border
              background: "#dc3545", // red background
              color: "white", // white text & icon
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isGeneratingPDF && !isLoading) {
                e.target.style.background = "#c82333"; // darker red on hover
                e.target.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (!isGeneratingPDF && !isLoading) {
                e.target.style.background = "#dc3545"; // original red
                e.target.style.color = "white";
              }
            }}
          >
            <MdFileDownload size={16} />
            {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
          </Button>

          <div
            className="date-range-container"
            style={{ position: "relative" }}
            ref={datePickerRef}
          >
            <div
              className="date-range-display"
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f8f9fa",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
                minWidth: "300px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <MdCalendarToday
                  style={{ color: "#6c757d", fontSize: "16px" }}
                />
                <span style={{ fontWeight: "500", color: "#495057" }}>
                  {formatDateRange()}
                </span>
              </div>

              <span
                style={{
                  color: "#6c757d",
                  fontSize: "12px",
                  transform: showDatePicker ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </div>

            {showDatePicker && (
              <div
                className="date-picker-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 1000,
                  background: "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  marginTop: "4px",
                  minWidth: "350px",
                }}
              >
                {/* Quick preset options */}
                <div
                  style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}
                >
                  <div
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    Quick Select
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {[
                      { label: "Today", days: 0 },
                      { label: "Yesterday", days: 1 },
                      { label: "Last 7 Days", days: 7 },
                      { label: "Last 30 Days", days: 30 },
                      { label: "Last 90 Days", days: 90 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => applyPresetRange(preset.days)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #dee2e6",
                          background: "white",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "#495057",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#f8f9fa";
                          e.target.style.borderColor = "#007bff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "white";
                          e.target.style.borderColor = "#dee2e6";
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom date inputs */}
                <div style={{ padding: "12px" }}>
                  <div
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    Custom Range
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        From Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForAPI(dateRange.startDate)}
                        onChange={(e) =>
                          handleDateRangeChange("startDate", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        To Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForAPI(dateRange.endDate)}
                        onChange={(e) =>
                          handleDateRangeChange("endDate", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    borderTop: "1px solid #dee2e6",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => setShowDatePicker(false)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #dee2e6",
                      background: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    style={{
                      padding: "6px 12px",
                      border: "none",
                      background: "#007bff",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metrics-scroll-container">
          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Users</div>
                  <h3 className="metric-value">
                    {isLoading
                      ? "Loading..."
                      : dashboardData.total_users_count.toLocaleString()}
                  </h3>
                  <div className="metric-change">Active users</div>
                </div>
                <div className="metric-icon users-icon">
                  <BsPeople />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Workouts</div>
                  <h3 className="metric-value">
                    {isLoading
                      ? "Loading..."
                      : dashboardData.total_workout_count.toLocaleString()}
                  </h3>
                  <div className="metric-change">Completed workouts</div>
                </div>
                <div className="metric-icon workouts-icon">
                  <MdFitnessCenter />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Meal Plans</div>
                  <h3 className="metric-value">
                    {isLoading
                      ? "Loading..."
                      : dashboardData.total_meals_count.toLocaleString()}
                  </h3>
                  <div className="metric-change">Total meals logged</div>
                </div>
                <div className="metric-icon meals-icon">
                  <MdRestaurantMenu />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Subscriptions</div>
                  <h3 className="metric-value">
                    {isLoading
                      ? "Loading..."
                      : `$${dashboardData.total_subscriptions_amount.toLocaleString()}`}
                  </h3>
                  <div className="metric-change">Total revenue</div>
                </div>
                <div className="metric-icon revenue-icon">
                  <MdAttachMoney />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-container">
          <div className="user-activity-chart">
            <Card className="chart-card">
              <Card.Body className="chart-content">
                <h6 className="chart-title">
                  Meals & Workouts Activity
                  {isLoading && (
                    <span style={{ fontSize: "12px", color: "#6c757d" }}>
                      {" "}
                      (Loading...)
                    </span>
                  )}
                </h6>
                <div className="chart-containersss">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mealWorkoutChartData}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="workout_count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name="Workouts"
                      />
                      <Bar
                        dataKey="meal_log_count"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        name="Meals"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="workout-progress-chart">
            <Card className="chart-card">
              <Card.Body className="chart-content">
                <h6 className="chart-title">
                  Workout Progress
                  {isLoading && (
                    <span style={{ fontSize: "12px", color: "#6c757d" }}>
                      {" "}
                      (Loading...)
                    </span>
                  )}
                </h6>
                <div className="chart-containersss">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={workoutProgressData}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cardio"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                        name="Meals"
                      />
                      <Line
                        type="monotone"
                        dataKey="strength"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                        name="WorkOut"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Recent Activities - Left Side (wider) */}
        <div className="activities-section">
          <Card className="section-card">
            <Card.Body className="section-content">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="section-title mb-0">Recent Activities</h6>
                <button
                  className="btn btn-link p-0 text-danger"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    navigate("/recent-activity");
                  }}
                >
                  See All
                </button>
              </div>
              <div className="activities-list">
                {isLoading ? (
                  <div className="text-center">Loading activities...</div>
                ) : dashboardData.recent_activities &&
                  dashboardData.recent_activities.length > 0 ? (
                  dashboardData.recent_activities
                    ?.slice(0, 5)
                    .map((activity, index) => (
                      <div
                        key={`${activity.user_id}-${index}`}
                        className="activity-item"
                        style={{ alignItems: "center" }}
                      >
                        {/* <div className="activity-avatar">
                        {getInitials(activity.user_name)}
                      </div> */}
                        <img
                          src={
                            activity.image ||
                            "https://fastly.picsum.photos/id/507/200/300.jpg?hmac=v0NKvUrOWTKZuZFmMlLN_7-RdRgeF-qFLeBGXpufxgg"
                          }
                          alt="activity-img"
                          title="Activity Image"
                          style={{
                            imageRendering: "-webkit-optimize-contrast",
                            height: "2.5rem",
                            width: "2.5rem",
                            border: "2px solid var(--button-secondary-red)",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                            alignSelf: "center",
                          }}
                        />
                        <div className="activity-content">
                          <div className="activity-text">
                            <span className="activity-user">
                              {activity.user_name}
                            </span>{" "}
                            {activity.title.toLowerCase().includes("support")
                              ? "sent a support message"
                              : activity.title}
                            {activity.message && (
                              <span className="activity-detail">
                                : "{activity.message}"
                              </span>
                            )}
                          </div>
                          <div className="activity-time">
                            {activity?.time_ago}
                          </div>
                        </div>
                        <Badge
                          className="activity-chip"
                          style={{
                            backgroundColor: getTypeColor(activity.type),
                            color: "white",
                          }}
                        >
                          {getActivityType(activity.type)}
                        </Badge>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-muted">
                    No recent activities found
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
