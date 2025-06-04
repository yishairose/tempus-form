import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");

interface EmailResponse {
  success: boolean;
  error?: string;
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
    property_experience?: string;
    assets_and_liabilities?: string;
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
      to_email: process.env.NEXT_PUBLIC_RECIPIENT_EMAIL,
      product: data.product,
      broker_info: {
        is_broker: data.broker_info.is_broker,
        contact_name: data.broker_info.contact_name || "",
        company_name: data.broker_info.company_name || "",
        phone_number: data.broker_info.phone_number || "",
        email_address: data.broker_info.email_address || "",
        fee: data.broker_info.fee || "",
      },
      borrower_info: {
        corporate_name: data.borrower_info.corporate_name,
        company_number: data.borrower_info.company_number,
        phone_number: data.borrower_info.phone_number,
        email_address: data.borrower_info.email_address,
        property_experience: data.borrower_info.property_experience || "",
        assets_and_liabilities: data.borrower_info.assets_and_liabilities || "",
        credit_info: data.borrower_info.credit_info || "",
      },
      loan_info: {
        purpose_of_funds: data.loan_info.purpose_of_funds,
        background_story: data.loan_info.background_story,
        net_amount_required_day_one: data.loan_info.net_amount_required_day_one,
        net_amount_required_for_works:
          data.loan_info.net_amount_required_for_works,
        ltv_required: data.loan_info.ltv_required,
        loan_term: data.loan_info.loan_term,
        exit_strategy: data.loan_info.exit_strategy,
        solicitors_name: data.loan_info.solicitors_name,
        solicitors_firm: data.loan_info.solicitors_firm,
        solicitors_email: data.loan_info.solicitors_email,
        solicitors_phone: data.loan_info.solicitors_phone,
      },
      security_info: {
        securities: data.security_info.securities.map((security) => ({
          asset_type: security.asset_type,
          address_line1: security.address_line1,
          address_line2: security.address_line2 || "",
          city: security.city || "",
          post_code: security.post_code,
          ownership: security.ownership,
          years_remaining: security.years_remaining || "",
          purchase_price: security.purchase_price,
          current_debt: security.current_debt,
          rental_income: security.rental_income || "",
          description: {
            property_details: security.description.property_details,
          },
          estimated_value: security.estimated_value,
          estimated_gdv: security.estimated_gdv || "",
        })),
      },
      additional_info: {
        documents:
          data.additional_info.documents?.map((doc) => ({
            file_name: doc.file_name,
            file_url: doc.file_url,
          })) || [],
        credit_consent: data.additional_info.credit_consent,
      },
    };

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
