export const commentsCellOptions = [
  { value: "Price", label: "מחיר" },
  { value: "DiscountPrc", label: "% הנחה" },
  { value: "Details", label: "פרטים" },
  { value: "ItemName", label: "שם פריט" },
  { value: "Warehouse", label: "מחסן" },
  { value: "Agent", label: "סוכן" },
  { value: "CommitionPrc", label: "עמלה" },
];

export const docInformationOptions = [
  { value: "AccountName", label: "שם לקוח" },
  { value: "Address", label: "כתובת" },
  { value: "Phone", label: "טלפון" },
  { value: "ValueDate", label: "תאריך" },
  { value: "DiscountPrc", label: "% הנחה" },
  { value: "Tftal", label: "סכום כולל של מסמך" },
  { value: "Remarks", label: "הערות" },
  { value: "Details", label: "פרטים" },
  { value: "Agent", label: "סוכן" },
  { value: "Osek874", label: "עוסק מורשה" },
  { value: "Email", label: "דואר אלקטרוני" },
];

export const docConfigOptions = [
  { value: "none", label: "ללא" },
  {
    value: "taxInvoice",
    label: "חשבונית מס",
  },
  {
    value: "taxInvoiceOrRecipt",
    label: "קבלה/חשבונית מס",
  },
  {
    value: "taxInvoiceRefound",
    label: "חשבונית מס זיכוי",
  },
  {
    value: "devliveryCertficate",
    label: "תעודת משלוח",
  },
  {
    value: "refound",
    label: "החזרה",
  },
  {
    value: "order",
    label: "הזמנה",
  },
  {
    value: "bidding",
    label: "הצעת מחיר",
  },
];

export const actionConfigOptions = [
  { value: "none", label: "ללא" },
  { value: "produce", label: "להפקה" },
  { value: "special", label: "מיוחד" },
];

export const MUDUL_SERVER_NAME = "http://localhost:4001";
export const AUTH_SERVER_NAME = "http://localhost:4000";

export const numOfColBeforeProducts = 3;
export const numOfColAfterProducts = 5;
export const titleWithoutProduct =
  numOfColBeforeProducts + numOfColAfterProducts;

export const savingAsAction = "savingAsAction";
export const savingAction = "savingAction";
export const produceDocAction = "produceDoc";
export const copyMatrixAction = "copyMatrix";

export const modalAction = {
  savingAsAction: "שמירה בשם",
  savingAction: "שמירה",
  copyMatrix: "שכפול מטריצה",
};

export const dateFormat = "mm/dd/yyyy";

export const produceError =
  " bizmod.solutions@gmail.com המטריצה נכשלה בהפקה. נא נסה שנית או פנה לתמיכה הטכנית במייל";
