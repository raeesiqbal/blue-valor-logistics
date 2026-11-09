export type LegalBlock =
  | { type: 'paragraph'; text: string; boldLead?: string }
  | { type: 'list'; items: string[]; marker: 'letter' | 'dash' };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

export const privacySections: LegalSection[] = [
  {
    title: 'INFORMATION YOU GIVE US',
    blocks: [{ type: 'paragraph', text: 'When you request a quote, contact us, or send us a message through this website, we collect the information you provide, such as your name, company name, email address, phone number, and details about your freight. We use this information only to respond to you, provide quotes, arrange and manage your shipments, and communicate with you about our services.' }],
  },
  {
    title: 'INFORMATION COLLECTED AUTOMATICALLY',
    blocks: [{ type: 'paragraph', text: 'Like most websites, we collect basic information about how visitors use our site, such as pages viewed, time on page, clicks, scrolling, browser and device type, and general location (such as city or region). This helps us understand how the site is used and improve it.' }],
  },
  {
    title: 'GOOGLE ANALYTICS',
    blocks: [{ type: 'paragraph', text: 'We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies and similar technologies to collect usage information, which is sent to and stored by Google. You can learn how Google uses this information at https://policies.google.com/technologies/partner-sites. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on at https://tools.google.com/dlpage/gaoptout.' }],
  },
  {
    title: 'MICROSOFT CLARITY',
    blocks: [{ type: 'paragraph', text: 'We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay, to improve our website. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of pages and online activity. This information is also used for site optimization and fraud and security purposes. For more information about how Microsoft collects and uses your data, visit the Microsoft Privacy Statement at https://privacy.microsoft.com/privacystatement.' }],
  },
  {
    title: 'COOKIES',
    blocks: [{ type: 'paragraph', text: 'Cookies are small files stored on your device. You can block or delete cookies through your browser settings. Blocking cookies will not prevent you from using this website.' }],
  },
  {
    title: 'HOW WE SHARE INFORMATION',
    blocks: [{ type: 'paragraph', text: 'We do not sell your personal information. We share information only as needed to provide our services, such as giving shipment details to the carrier moving your freight, with service providers that help us run our business, or when required by law.' }],
  },
  {
    title: 'HOW WE PROTECT INFORMATION',
    blocks: [{ type: 'paragraph', text: 'We take reasonable steps to protect the information you provide. No website or method of transmission is completely secure, so we cannot guarantee absolute security.' }],
  },
  {
    title: 'CHILDREN',
    blocks: [{ type: 'paragraph', text: 'This website is intended for businesses and is not directed to children under 13. We do not knowingly collect information from children.' }],
  },
  {
    title: 'CHANGES TO THIS POLICY',
    blocks: [{ type: 'paragraph', text: 'We may update this policy from time to time. Any changes will be posted on this page with a new effective date.' }],
  },
  {
    title: 'CONTACT US',
    blocks: [{ type: 'paragraph', text: 'If you have questions about this policy, contact us at info@bluevalorlogistics.com or (239) 308-5789.' }],
  },
];

export const termsSections: LegalSection[] = [
  {
    title: 'ROLE, AUTHORITY, AND SCOPE',
    blocks: [{ type: 'paragraph', text: 'Blue Valor Logistics, LLC ("Broker") is a licensed property broker operating under Federal Motor Carrier Safety Administration (FMCSA) authority. Broker arranges for the transportation of freight by third-party, federally authorized motor carriers. Broker does not own or operate transportation equipment, does not take possession, custody, or control of freight, and is not a motor carrier, bailee, or insurer of freight. These Terms and Conditions of Service ("Terms") apply to all shippers, consignees, and motor carriers (each a "Party") that tender, accept, or arrange freight through Broker.' }],
  },
  {
    title: 'CARRIER SELECTION',
    blocks: [{ type: 'paragraph', text: 'Broker selects motor carriers in accordance with its carrier qualification standards, including verification of operating authority, safety rating, and insurance. Broker will make commercially reasonable efforts to arrange transportation with qualified carriers but makes no warranty regarding transit times, delivery dates, or the availability of a carrier for any shipment. If a shipper directs Broker to use a specific motor carrier, Broker will apply its carrier qualification standards to that carrier, and the shipper accepts responsibility for that selection. Broker may decline to arrange any shipment with any carrier that does not meet its standards, regardless of urgency or request.' }],
  },
  {
    title: 'QUOTES AND RATE CONFIRMATIONS',
    blocks: [{ type: 'paragraph', text: 'A rate quote is valid only for the shipment, equipment, and timeframe described, and for the period stated in the quote, and is subject to change based on shipment details, market conditions, or carrier availability at the time of tender. Each shipment is documented by a Rate Confirmation. A shipper accepts a Rate Confirmation when it signs it, confirms it by email or through a TMS or portal, or tenders the freight to the carrier assigned by Broker, whichever occurs first. The Rate Confirmation controls only as to terms specific to that shipment; all other matters are governed by these Terms or the applicable signed agreement.' }],
  },
  {
    title: 'SHIPPER RESPONSIBILITIES',
    blocks: [
      { type: 'paragraph', text: 'Each shipper shall:' },
      { type: 'list', marker: 'letter', items: [
        '(a) provide a true, complete, and accurate description of each shipment, including commodity, weight, dimensions, and handling requirements, and declare the accurate weight at tender;',
        '(b) where it loads the freight, properly package, block, brace, and secure it, and load it within legal gross vehicle and axle weight limits. The shipper is responsible for all costs resulting from a shipment that exceeds legal weight limits or the weight declared at tender, including reweigh, reworking, offloading, additional trucks, detention, TONU, and fines;',
        '(c) disclose in writing before tender if any shipment contains hazardous materials under 49 CFR Part 172, and provide all required placards, labels, and shipping papers;',
        '(d) where it loads and seals the trailer, record the seal number on the bill of lading, in which case the shipment is treated as "Shipper Load and Count";',
        '(e) release freight only to a driver and equipment matching the carrier name, driver name, and truck or trailer number provided by Broker, and contact Broker before releasing freight if any detail does not match;',
        '(f) for temperature-controlled shipments, state the required temperature and mode (continuous or cycle) in writing at tender, record it on the bill of lading, and tender product already at the required temperature. Neither Broker nor the carrier is liable for product loaded outside the required temperature range; and',
        '(g) for shipments of human or animal food, retain all responsibilities of a "shipper" under the FDA Sanitary Transportation of Human and Animal Food rule (21 CFR Part 1, Subpart O), including specifying in writing the sanitary requirements for the vehicle, the required operating temperature, and any pre-cooling requirement. The shipper\'s written instructions at tender, as reflected on the Rate Confirmation and bill of lading, constitute those specifications. Broker arranges transportation only and does not assume those responsibilities.',
      ] },
    ],
  },
  {
    title: 'CARRIER REQUIREMENTS',
    blocks: [{ type: 'paragraph', text: "No motor carrier may transport freight arranged by Broker without a signed Broker-Carrier Agreement in place. Carriers may not re-broker, double broker, interline, or subcontract any load without Broker's prior written consent, and may not seek payment from any shipper, consignee, or customer of Broker. Carriers must maintain the insurance described in Section 8 and comply with all identity, equipment, and driver verification requirements stated in the Broker-Carrier Agreement and Rate Confirmation." }],
  },
  {
    title: 'LIABILITY AND CARGO CLAIMS',
    blocks: [
      { type: 'paragraph', text: "Liability for loss, damage, or delay to freight while in the custody of a motor carrier is governed by the Carmack Amendment (49 U.S.C. § 14706) and rests with the transporting motor carrier, not Broker. Broker shall not be liable for loss, damage, or delay except to the extent directly caused by Broker's own negligence in performing its brokerage services." },
      { type: 'paragraph', text: "Visible loss or damage must be noted on the delivery receipt and reported to Broker within seventy-two (72) hours of delivery. Cargo claims must be filed in writing with the transporting carrier, with a copy to Broker, within nine (9) months of the delivery date or, for non-delivery, the scheduled delivery date. Upon request, Broker will forward a claim to the carrier on the shipper's behalf. Broker will facilitate communication between the claimant and the responsible carrier but is not obligated to adjust or pay claims." },
      { type: 'paragraph', text: "Broker requires the carriers it arranges to maintain cargo insurance of not less than $100,000 per shipment. If the value of any shipment exceeds $100,000, the shipper shall declare the value in writing to Broker before tender, with enough notice to allow Broker to arrange a carrier with adequate coverage. If no higher value is declared, recovery for loss or damage may be limited by the carrier's available cargo coverage, and Broker shall have no liability for any amount exceeding that coverage." },
      { type: 'paragraph', text: "In no event shall Broker or any carrier arranged by Broker be liable for special, incidental, consequential, or punitive damages, including lost profits or business interruption, or any fines, chargebacks, or penalties assessed by a shipper's customers, including on-time or in-full compliance fines, unless expressly agreed to by Broker in writing before tender." },
    ],
  },
  {
    title: 'PAYMENT TERMS',
    blocks: [
      { type: 'paragraph', boldLead: 'Payment to Carriers.', text: " Broker's standard payment term to carriers is Net 30 from Broker's receipt of a complete invoice packet, including the signed Rate Confirmation, a legible signed proof of delivery (POD), and support for any approved accessorial charges. Broker also offers an optional Quick Pay program. A carrier may elect Quick Pay for a load by requesting it in writing when submitting its invoice packet, and Broker will pay within two (2) business days of receipt of a complete invoice packet, less a discount of two percent (2%) of the line-haul rate. Approved accessorial charges are paid in full without discount. Broker may change or discontinue Quick Pay on written notice. If a carrier has assigned its receivables to a factoring company, Broker will honor a Notice of Assignment only after verifying it directly with the factoring company." },
      { type: 'paragraph', boldLead: 'Payment from Shippers.', text: ' New shippers must complete a credit application before payment terms are extended. Based on Broker\'s credit review, shippers will be assigned terms of Net 15 or Net 30 from the date of a proper invoice or, where credit is not established or does not meet Broker\'s standards, payment in advance or Cash on Delivery (COD). Broker may reduce or revoke credit, change payment terms, or require payment in advance at any time. Invoices not paid within the applicable term are subject to a late charge on the outstanding balance at the lesser of 1.5% per month or the maximum rate permitted by law, and Broker may suspend further service until the account is brought current. Shippers shall pay all invoices in full without deduction, offset, or counterclaim, including for any pending or disputed cargo claim, except for amounts disputed in good faith as a billing error. Any invoice dispute must be made in writing within ten (10) days of the invoice date, stating the amount disputed and the reason; otherwise the invoice is deemed accepted. Payment to Broker, or to Broker\'s factoring company as directed below, fully discharges the shipper\'s obligation to the transporting carrier for that shipment. Shippers shall pay all costs Broker incurs in collecting past-due amounts, including collection agency fees, court costs, and reasonable attorneys\' fees.' },
      { type: 'paragraph', boldLead: 'Factoring.', text: " Broker may assign its accounts receivable to a third-party factoring company. Where an assignment is in place, shippers will receive a written Notice of Assignment identifying the factoring company and remittance address, and must remit all payments as directed in that Notice. Payment to any other party, including Broker, will not discharge the shipper's payment obligation. Remittance instructions may only be changed by written notice from the factoring company or a signed release. Broker will never change its payment instructions by email alone; shippers should confirm any requested change by calling Broker at a known number." },
    ],
  },
  {
    title: 'CARRIER INSURANCE REQUIREMENTS',
    blocks: [
      { type: 'paragraph', text: 'Broker requires every motor carrier tendered a load to maintain, at minimum, the following coverage, verified before dispatch and periodically thereafter:' },
      { type: 'list', marker: 'dash', items: [
        'Auto Liability: $1,000,000 combined single limit',
        'Motor Truck Cargo: $100,000, including reefer breakdown coverage for refrigerated loads',
        'Workers\' Compensation: as required by applicable state law, or occupational accident coverage for owner-operators',
      ] },
      { type: 'paragraph', text: 'Carrier insurance must be issued by insurers rated A- or better by A.M. Best, or otherwise acceptable to Broker. Broker may require higher limits for high-value, specialized, or temperature-controlled freight, and may decline to tender freight to any carrier that does not meet these requirements.' },
    ],
  },
  {
    title: 'ACCESSORIAL CHARGES',
    blocks: [
      { type: 'paragraph', text: "Shippers are responsible for the following accessorial charges when resulting from conditions at the shipper's facility, at the facility of the shipper's consignee or receiver, or otherwise within the shipper's control:" },
      { type: 'list', marker: 'letter', items: [
        '(a) Detention: $75.00 per hour for dry van and flatbed shipments, and $85.00 per hour for refrigerated shipments, after two (2) hours of free time at pickup or delivery, subject to documented check-in and check-out times. Free time begins at the later of the scheduled appointment time or the driver\'s documented check-in time. Where no appointment is scheduled, free time begins at the driver\'s documented check-in time.',
        '(b) Truck Ordered Not Used (TONU): $300.00 flat fee where a scheduled pickup is cancelled, or freight is not ready for pickup and the shipment cannot move, after carrier dispatch.',
        '(c) Stop-Off / Re-Delivery: $75.00 per occurrence for an additional stop, re-delivery attempt, or rescheduling resulting from inaccurate or incomplete information provided by the shipper.',
        '(d) Layover: $350.00 per day when a truck is held overnight, or for more than twenty-four (24) hours, because a shipment is not ready, an appointment is rescheduled or delayed by the shipper or its consignee or receiver, or a facility cannot load or unload on the scheduled date. Detention accrued on the same day before layover begins remains payable. Layover begins at the earlier of (i) the time the shipper, its consignee or receiver, or the facility informs Broker or the carrier that the shipment will not be loaded or unloaded until the following day, or (ii) the close of the facility\'s shipping or receiving hours that day, and detention stops accruing at that time. Detention does not accrue for any period billed as layover. Free time restarts at any rescheduled appointment, and detention after a layover accrues only if the truck is held more than two (2) hours past the rescheduled appointment.',
        '(e) Lumper and Unloading Fees: the actual charge for third-party loading or unloading services required by a facility, supported by a lumper receipt.',
        '(f) Refused or Returned Freight: where a consignee refuses or rejects a shipment for reasons not caused by the carrier, the resulting return, storage, re-delivery, detention, and disposal charges, at documented actual cost.',
      ] },
      { type: 'paragraph', text: 'Broker may adjust these rates for shipments requiring specialized equipment, extended free time, or unusual circumstances, as reflected on the applicable Rate Confirmation. All accessorial charges must be supported by appropriate documentation. Where documentation for an accessorial charge is received after the original invoice is issued, Broker may issue a supplemental invoice, and the dispute period runs from the date of the supplemental invoice.' },
    ],
  },
  {
    title: 'CONFIDENTIALITY AND NON-CIRCUMVENTION',
    blocks: [{ type: 'paragraph', text: "Each Party shall treat as confidential all rate information, load and lane details, customer and carrier contact information, and other business or pricing terms exchanged in connection with a shipment. For twelve (12) months after its last shipment through Broker, no Party shall use such information to circumvent Broker, and no shipper shall tender freight directly to a carrier introduced by Broker, and no carrier shall solicit or accept freight directly from a shipper or consignee introduced by Broker, without Broker's prior written consent. This restriction does not apply to any relationship a Party can show, through written records, existed before Broker's introduction." }],
  },
  {
    title: 'BILLS OF LADING',
    blocks: [{ type: 'paragraph', text: "Any insertion of Broker's name on a bill of lading is for convenience only and does not change Broker's status as a property broker. The terms of any bill of lading, delivery receipt, carrier tariff, or other shipping document do not supplement, alter, or modify these Terms." }],
  },
  {
    title: 'FORCE MAJEURE',
    blocks: [{ type: 'paragraph', text: 'Broker and its carriers shall not be liable for delay or failure to perform resulting from causes beyond their reasonable control, including acts of God, severe weather, strikes or labor disputes, government action, road closures, or other events that could not reasonably have been foreseen or avoided. Force majeure does not excuse or delay any obligation to pay amounts due for services already performed.' }],
  },
  {
    title: 'COMPLIANCE',
    blocks: [{ type: 'paragraph', text: 'All Parties shall comply with applicable federal, state, and local laws and regulations, including FMCSA regulations governing property brokers and motor carriers. Broker will never request or require that a carrier or driver violate any safety law or regulation, including hours-of-service rules, to meet any pickup or delivery time.' }],
  },
  {
    title: 'GENERAL PROVISIONS',
    blocks: [{ type: 'paragraph', text: 'Broker may amend these Terms from time to time; the version in effect at the time a load is tendered governs that transaction. Tendering freight to Broker, or accepting a load from Broker, constitutes acceptance of these Terms. If a Party has signed a Shipper-Broker Agreement or Broker-Carrier Agreement with Broker, that agreement controls where it conflicts with these Terms. These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles, and any dispute shall be brought exclusively in the state or federal courts located in Lee County, Florida. Notices and confirmations may be given by email, and electronic signatures and records are valid and binding. If any provision of these Terms is held unenforceable, the remaining provisions continue in full force and effect.' }],
  },
  {
    title: 'USE OF THIS WEBSITE',
    blocks: [{ type: 'paragraph', text: 'The information on this website, including load calculator results, is provided for general informational purposes only. Calculator results are estimates, not quotes or guarantees of capacity, and every shipment is subject to a written Rate Confirmation. Use of this website is also subject to our Privacy Policy.' }],
  },
  {
    title: 'CONTACT INFORMATION',
    blocks: [
      { type: 'paragraph', text: 'If you have any questions about these Terms, please contact us:' },
      { type: 'paragraph', text: 'Blue Valor Logistics, LLC\nFort Myers, Florida\nEmail: info@bluevalorlogistics.com\nPhone: (239) 308-5789' },
    ],
  },
];
