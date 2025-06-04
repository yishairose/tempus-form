import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");

export const sendEmail = async (formData: any) => {
  try {
    // Format securities as plain text
    const securitiesText =
      formData.securityInfo?.securities
        ?.map(
          (security: any, index: number) => `
Security ${index + 1}:
Asset Type: ${security.assetType || "N/A"}
Address: ${
            [
              security.addressLine1,
              security.addressLine2,
              security.city,
              security.postCode,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"
          }
Ownership: ${security.ownership || "N/A"}
Years Remaining: ${
            security.ownership === "leasehold" ? security.yearsRemaining : "N/A"
          }
Purchase Price: ${security.purchasePrice ? `£${security.purchasePrice}` : "N/A"}
Current Debt: ${security.currentDebt ? `£${security.currentDebt}` : "N/A"}
Rental Income: ${security.rentalIncome ? `£${security.rentalIncome}` : "N/A"}
Estimated Value: ${
            security.estimatedValue ? `£${security.estimatedValue}` : "N/A"
          }
Estimated GDV: ${security.estimatedGDV ? `£${security.estimatedGDV}` : "N/A"}
Property Details: ${security.description?.propertyDetails || "N/A"}
-------------------`
        )
        .join("\n\n") || "No securities provided";

    // Get file URL from API
    const getFileUrl = async (fileId: string) => {
      try {
        const response = await fetch(`/api/files/${fileId}`);
        if (!response.ok) {
          throw new Error("Failed to get file URL");
        }
        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error("Error getting file URL:", error);
        return null;
      }
    };

    // Format attachments with URLs
    const formatAttachment = async (file: any) => {
      if (!file) return "N/A";
      const url = await getFileUrl(file.file_id);
      return url ? `${file.file_name} (${url})` : file.file_name;
    };

    const formatAttachments = async (files: any[]) => {
      if (!files || files.length === 0) return "N/A";
      const formattedFiles = await Promise.all(
        files.map((file) => formatAttachment(file))
      );
      return formattedFiles.join("\n");
    };

    // Format the data for EmailJS template
    const templateParams = {
      product: formData.product || "N/A",
      agreement: formData.agreement ? "Yes" : "No",

      // Broker Information
      broker_is_broker: formData.brokerInfo?.isBroker ? "Yes" : "No",
      broker_contact_name: formData.brokerInfo?.brokerContactName || "N/A",
      broker_company_name: formData.brokerInfo?.brokerCompanyName || "N/A",
      broker_phone: formData.brokerInfo?.brokerPhoneNumber || "N/A",
      broker_email: formData.brokerInfo?.brokerEmailAddress || "N/A",
      broker_fee: formData.brokerInfo?.brokerFee || "N/A",

      // Borrower Information
      borrower_corporate_name:
        formData.borrowerInfo?.borrowerCorporateName || "N/A",
      borrower_company_number:
        formData.borrowerInfo?.borrowerCompanyNumber || "N/A",
      borrower_phone: formData.borrowerInfo?.borrowerPhoneNumber || "N/A",
      borrower_email: formData.borrowerInfo?.borrowerEmailAddress || "N/A",
      borrower_credit_info: formData.borrowerInfo?.borrowerCreditInfo || "N/A",

      // Loan Information
      purpose_of_funds: formData.loanInfo?.purposeOfFunds || "N/A",
      background_story: formData.loanInfo?.backgroundStory || "N/A",
      net_amount_day_one: formData.loanInfo?.netAmountRequiredDayOne
        ? `£${formData.loanInfo.netAmountRequiredDayOne}`
        : "N/A",
      net_amount_works: formData.loanInfo?.netAmountRequiredForWorks
        ? `£${formData.loanInfo.netAmountRequiredForWorks}`
        : "N/A",
      ltv_required: formData.loanInfo?.ltvRequired
        ? `${formData.loanInfo.ltvRequired}%`
        : "N/A",
      loan_term: formData.loanInfo?.loanTerm
        ? `${formData.loanInfo.loanTerm} months`
        : "N/A",
      exit_strategy: formData.loanInfo?.exitStrategy || "N/A",

      // Solicitor Information
      solicitors_name: formData.loanInfo?.solicitorsName || "N/A",
      solicitors_firm: formData.loanInfo?.solicitorsFirm || "N/A",
      solicitors_email: formData.loanInfo?.solicitorsEmail || "N/A",
      solicitors_phone: formData.loanInfo?.solicitorsPhone || "N/A",

      // Security Information
      securities: securitiesText,

      // Additional Information
      credit_search_consent: formData.additionalInfo?.q2 ? "Yes" : "No",

      // Attachments with URLs
      property_experience: await formatAttachment(
        formData.borrowerInfo?.borrowerPropertyExperience
      ),
      assets_liabilities: await formatAttachment(
        formData.borrowerInfo?.borrowerAssetsAndLiabilities
      ),
      additional_documents: await formatAttachments(
        formData.additionalInfo?.q1 || []
      ),
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
      templateParams
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("EmailJS error:", error);
    return { success: false, error };
  }
};
