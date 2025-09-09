import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Admin/assets/css/UserLeaveRequest.css";

export default function LeaveRequest() {
  const [submitted, setSubmitted] = useState(false);

  const initialValues = {
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    userId: "",
    remark: "",
    status: "",
    appliedOn: "",
    approvedBy: "",
    createdAt: "",
  };

  const validationSchema = Yup.object({
    employeeName: Yup.string().required("Employee name is required"),
    leaveType: Yup.string().required("Leave type is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date"),
    reason: Yup.string()
      .min(10, "Reason must be at least 10 characters")
      .required("Reason is required"),
    userId: Yup.number().required("User ID is required"),
    remark: Yup.string().required("Remark is required"),
    status: Yup.string().required("Status is required"),
    appliedOn: Yup.date().required("Applied On date is required"),
    approvedBy: Yup.number().required("Approved By (User ID) is required"),
    createdAt: Yup.date().required("Created At date is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log("Submitted:", values);
    setSubmitted(true);
    resetForm();

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="leave-request-page">
      <div className="leave-request-container">
        <h2 className="form-title">Leave Request</h2>
        <p className="form-subtitle">
          Fill out the form below to request your leave.
        </p>

        {submitted && (
          <div className="success-message">
            ✅ Your leave request has been submitted successfully!
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="leave-request-form">
              {/* Employee Name */}
              <div className="form-group">
                <label>Employee Name</label>
                <Field type="text" name="employeeName" className="form-input" />
                <ErrorMessage name="employeeName" component="div" className="error" />
              </div>

              {/* User ID */}
              <div className="form-group">
                <label>User ID</label>
                <Field type="number" name="userId" className="form-input" />
                <ErrorMessage name="userId" component="div" className="error" />
              </div>

              {/* Leave Type */}
              <div className="form-group">
                <label>Leave Type</label>
                <Field as="select" name="leaveType" className="form-input">
                  <option value="">Select leave type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </Field>
                <ErrorMessage name="leaveType" component="div" className="error" />
              </div>

              {/* Dates */}
              <div className="form-row">
                <div className="form-group half">
                  <label>Start Date</label>
                  <Field type="date" name="startDate" className="form-input" />
                  <ErrorMessage name="startDate" component="div" className="error" />
                </div>

                <div className="form-group half">
                  <label>End Date</label>
                  <Field type="date" name="endDate" className="form-input" />
                  <ErrorMessage name="endDate" component="div" className="error" />
                </div>
              </div>

              {/* Reason */}
              <div className="form-group">
                <label>Reason</label>
                <Field as="textarea" name="reason" className="form-input textarea" rows="4" />
                <ErrorMessage name="reason" component="div" className="error" />
              </div>

              {/* Remark */}
              <div className="form-group">
                <label>Remark</label>
                <Field as="textarea" name="remark" className="form-input textarea" rows="3" />
                <ErrorMessage name="remark" component="div" className="error" />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>
                <Field as="select" name="status" className="form-input">
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error" />
              </div>

              {/* Applied On */}
              <div className="form-group">
                <label>Applied On</label>
                <Field type="datetime-local" name="appliedOn" className="form-input" />
                <ErrorMessage name="appliedOn" component="div" className="error" />
              </div>

              {/* Approved By */}
              <div className="form-group">
                <label>Approved By (User ID)</label>
                <Field type="number" name="approvedBy" className="form-input" />
                <ErrorMessage name="approvedBy" component="div" className="error" />
              </div>

              {/* Created At */}
              <div className="form-group">
                <label>Created At</label>
                <Field type="datetime-local" name="createdAt" className="form-input" />
                <ErrorMessage name="createdAt" component="div" className="error" />
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn">Submit Request</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
