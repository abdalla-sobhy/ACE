"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./Teachers.module.css";
import {
  FaChalkboardTeacher,
  FaCheck,
  FaTimes,
  FaDownload,
  FaEye,
  FaFilter,
} from "react-icons/fa";

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_approved: boolean;
  status: string;
  created_at: string;
  teacher_profile?: {
    specialization: string;
    years_of_experience: string;
    cv_path: string | null;
  };
}

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    checkAuth();
    fetchTeachers();
  }, [filter]);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "admin") {
      router.push("/");
      return;
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const endpoint = filter === 'pending'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers/pending`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users?user_type=teacher${filter === 'approved' ? '&is_approved=1' : ''}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (filter === 'pending') {
          setTeachers(data.teachers.data || data.teachers);
        } else {
          setTeachers(data.data.data || data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveTeacher = async (teacherId: number) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers/${teacherId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Teacher approved successfully!");
        fetchTeachers();
      } else {
        alert("Failed to approve teacher");
      }
    } catch (error) {
      console.error("Error approving teacher:", error);
      alert("Error approving teacher");
    }
  };

  const rejectTeacher = async () => {
    if (!selectedTeacher || !rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers/${selectedTeacher.id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (response.ok) {
        alert("Teacher rejected successfully!");
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedTeacher(null);
        fetchTeachers();
      } else {
        alert("Failed to reject teacher");
      }
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      alert("Error rejecting teacher");
    }
  };

  const downloadCV = async (teacherId: number, teacherName: string) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/teachers/${teacherId}/cv`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${teacherName}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("CV not found");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Error downloading CV");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1>
              <FaChalkboardTeacher /> Teacher Management
            </h1>
            <p>Approve and manage teacher applications</p>
          </div>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending Approval
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Teachers
          </button>
        </div>

        {teachers.length === 0 ? (
          <div className={styles.emptyState}>
            <FaChalkboardTeacher />
            <p>No teachers found</p>
          </div>
        ) : (
          <div className={styles.teachersTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{`${teacher.first_name} ${teacher.last_name}`}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.teacher_profile?.specialization || "N/A"}</td>
                    <td>{teacher.teacher_profile?.years_of_experience || "N/A"} years</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          teacher.is_approved ? styles.approved : styles.pending
                        }`}
                      >
                        {teacher.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        {teacher.teacher_profile?.cv_path && (
                          <button
                            className={styles.downloadBtn}
                            onClick={() => downloadCV(teacher.id, `${teacher.first_name}_${teacher.last_name}`)}
                            title="Download CV"
                          >
                            <FaDownload />
                          </button>
                        )}
                        {!teacher.is_approved && (
                          <>
                            <button
                              className={styles.approveBtn}
                              onClick={() => approveTeacher(teacher.id)}
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setShowRejectModal(true);
                              }}
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Reject Teacher Application</h2>
            <p>
              Please provide a reason for rejecting{" "}
              <strong>
                {selectedTeacher?.first_name} {selectedTeacher?.last_name}
              </strong>
              &apos;s application:
            </p>
            <textarea
              className={styles.textarea}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={5}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedTeacher(null);
                }}
              >
                Cancel
              </button>
              <button className={styles.confirmRejectBtn} onClick={rejectTeacher}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
