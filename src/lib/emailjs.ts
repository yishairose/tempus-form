import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");

interface EmailResponse {
  success: boolean;
  error?: string;
}

interface FileInfo {
  file_id: string;
  file_url: string;
  file_name: string;
}

interface TemplateParams {
  to_email: string;
  product: string;
  broker_info: {
    is_broker: boolean;
    contact_name?: string;
    company_name?: string;
    phone_number?: string;
    email_address?: string;
    fee?: string;
  };
  borrower_info: {
    corporate_name: string;
    company_number: string;
    phone_number: string;
    email_address: string;
    property_experience?: FileInfo | null;
    assets_and_liabilities?: FileInfo | null;
    credit_info?: string;
  };
  loan_info: {
    purpose_of_funds: string;
    background_story: string;
    net_amount_required_day_one: string;
    net_amount_required_for_works: string;
    ltv_required: string;
    loan_term: string;
    exit_strategy: string;
    solicitors_name: string;
    solicitors_firm: string;
    solicitors_email: string;
    solicitors_phone: string;
  };
  security_info: {
    securities: Array<{
      asset_type: string;
      address_line1: string;
      address_line2?: string;
      city?: string;
      post_code: string;
      ownership: string;
      years_remaining?: string;
      purchase_price: string;
      current_debt: string;
      rental_income?: string;
      description: {
        property_details: string;
      };
      estimated_value: string;
      estimated_gdv?: string;
    }>;
  };
  additional_info: {
    documents?: Array<{
      file_name: string;
      file_url: string;
    }>;
    credit_consent: boolean;
  };
}

export async function sendEmail(data: TemplateParams): Promise<EmailResponse> {
  try {
    const templateParams = {
      // Product Selection
      product: data.product,
      agreement: "Accepted", // Since this is required in the form

      // Broker Information
      broker_is_broker: data.broker_info.is_broker ? "Yes" : "No",
      broker_contact_name: data.broker_info.contact_name || "",
      broker_company_name: data.broker_info.company_name || "",
      broker_phone: data.broker_info.phone_number || "",
      broker_email: data.broker_info.email_address || "",
      broker_fee: data.broker_info.fee || "",

      // Borrower Information
      borrower_corporate_name: data.borrower_info.corporate_name || "",
      borrower_company_number: data.borrower_info.company_number || "",
      borrower_phone: data.borrower_info.phone_number || "",
      borrower_email: data.borrower_info.email_address || "",
      borrower_credit_info: data.borrower_info.credit_info || "",

      // Loan Information
      purpose_of_funds: data.loan_info.purpose_of_funds || "",
      background_story: data.loan_info.background_story || "",
      net_amount_day_one: data.loan_info.net_amount_required_day_one || "0",
      net_amount_works: data.loan_info.net_amount_required_for_works || "0",
      ltv_required: data.loan_info.ltv_required || "0",
      loan_term: data.loan_info.loan_term || "0",
      exit_strategy: data.loan_info.exit_strategy || "",

      // Solicitor Information
      solicitors_name: data.loan_info.solicitors_name || "",
      solicitors_firm: data.loan_info.solicitors_firm || "",
      solicitors_email: data.loan_info.solicitors_email || "",
      solicitors_phone: data.loan_info.solicitors_phone || "",

      // Security Information
      securities: data.security_info.securities
        .map((security, index) => {
          return `Security ${index + 1}:
Asset Type: ${security.asset_type || ""}
Address: ${security.address_line1 || ""}${
            security.address_line2 ? `, ${security.address_line2}` : ""
          }${security.city ? `, ${security.city}` : ""}
Post Code: ${security.post_code || ""}
Ownership: ${security.ownership || ""}
Years Remaining: ${security.years_remaining || ""}
Purchase Price: ${security.purchase_price || "0"}
Current Debt: ${security.current_debt || "0"}
Rental Income: ${security.rental_income || ""}
Property Details: ${security.description.property_details || ""}
Estimated Value: ${security.estimated_value || "0"}
Estimated GDV: ${security.estimated_gdv || ""}
`;
        })
        .join("\n"),

      // Additional Information
      credit_search_consent: data.additional_info.credit_consent ? "Yes" : "No",

      // Attachments
      property_experience: data.borrower_info.property_experience
        ? `File: ${data.borrower_info.property_experience.file_name}\nURL: ${data.borrower_info.property_experience.file_url}`
        : "",
      assets_liabilities: data.borrower_info.assets_and_liabilities
        ? `File: ${data.borrower_info.assets_and_liabilities.file_name}\nURL: ${data.borrower_info.assets_and_liabilities.file_url}`
        : "",
      additional_documents:
        data.additional_info.documents
          ?.map((doc) => `File: ${doc.file_name}\nURL: ${doc.file_url}`)
          .join("\n\n") || "",
    };

    console.log(
      "Sending email with template params:",
      JSON.stringify(templateParams, null, 2)
    );

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
      templateParams
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
