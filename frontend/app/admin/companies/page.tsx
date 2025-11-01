"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./Companies.module.css";
import { FaBuilding, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
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
        alert(t("admin.companies.companyVerifiedSuccess"));
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
        alert(t("admin.companies.companyUnverifiedSuccess"));
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
          <h1><FaBuilding /> {t("admin.companies.title")}</h1>
          <p>{t("admin.companies.subtitle")}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder={t("admin.companies.searchPlaceholder")}
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
            <option value="">{t("admin.companies.allCompanies")}</option>
            <option value="1">{t("admin.companies.verified")}</option>
            <option value="0">{t("admin.companies.unverified")}</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("admin.companies.loadingCompanies")}</p>
          </div>
        ) : (
          <div className={styles.companiesTable}>
            <table>
              <thead>
                <tr>
                  <th>{t("admin.companies.companyName")}</th>
                  <th>{t("admin.companies.industry")}</th>
                  <th>{t("admin.companies.contact")}</th>
                  <th>{t("admin.companies.status")}</th>
                  <th>{t("admin.companies.joined")}</th>
                  <th>{t("admin.companies.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.company_name}</td>
                    <td>{company.industry}</td>
                    <td>{company.user?.email || t("admin.companies.na")}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          company.is_verified ? styles.verified : styles.unverified
                        }`}
                      >
                        {company.is_verified ? (
                          <>
                            <FaCheckCircle /> {t("admin.companies.verified")}
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> {t("admin.companies.unverified")}
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
                            {t("admin.companies.unverify")}
                          </button>
                        ) : (
                          <button
                            className={styles.verifyBtn}
                            onClick={() => verifyCompany(company.id)}
                          >
                            {t("admin.companies.verify")}
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
