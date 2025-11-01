"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./Companies.module.css";
import { FaBuilding, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Company {
  id: number;
  company_name: string;
  industry: string;
  is_verified: boolean;
  created_at: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  useEffect(() => {
    checkAuth();
    fetchCompanies();
  }, [verifiedFilter]);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "admin") {
      router.push("/");
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const params = new URLSearchParams();
      if (verifiedFilter) params.append("is_verified", verifiedFilter);
      if (search) params.append("search", search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companies?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data.data || data.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompany = async (companyId: number) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companies/${companyId}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Company verified successfully!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error verifying company:", error);
    }
  };

  const unverifyCompany = async (companyId: number) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companies/${companyId}/unverify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Company unverified successfully!");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error unverifying company:", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1><FaBuilding /> Company Management</h1>
          <p>Verify and manage companies</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchCompanies()}
            />
          </div>
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">All Companies</option>
            <option value="1">Verified</option>
            <option value="0">Unverified</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading companies...</p>
          </div>
        ) : (
          <div className={styles.companiesTable}>
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.company_name}</td>
                    <td>{company.industry}</td>
                    <td>{company.user?.email || "N/A"}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          company.is_verified ? styles.verified : styles.unverified
                        }`}
                      >
                        {company.is_verified ? (
                          <>
                            <FaCheckCircle /> Verified
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td>{new Date(company.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        {company.is_verified ? (
                          <button
                            className={styles.unverifyBtn}
                            onClick={() => unverifyCompany(company.id)}
                          >
                            Unverify
                          </button>
                        ) : (
                          <button
                            className={styles.verifyBtn}
                            onClick={() => verifyCompany(company.id)}
                          >
                            Verify
                          </button>
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
    </div>
  );
}
