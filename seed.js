const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const APPS_SCRIPT_URL = process.argv[2];

if (!APPS_SCRIPT_URL) {
  console.error('Usage: node seed.js YOUR_APPS_SCRIPT_URL');
  process.exit(1);
}

const NODES = [
  { id: 'law', label: 'Law', layer: 1, parent_id: '', definition: 'The system of rules created and enforced through social or governmental institutions to regulate behavior.', citation: 'Black\'s Law Dictionary (11th ed. 2019)', authority_level: 'constitutional', jurisdiction: 'universal', temporal_valid_from: '', temporal_valid_to: '', notes: 'Root node' },

  { id: 'constitutional_law', label: 'Constitutional Law', layer: 2, parent_id: 'law', definition: 'The body of law that defines the relationship of different entities within a state, namely the executive, the legislature, and the judiciary.', citation: 'Marbury v. Madison, 5 U.S. 137 (1803)', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1803, temporal_valid_to: '', notes: '' },
  { id: 'criminal_law', label: 'Criminal Law', layer: 2, parent_id: 'law', definition: 'The body of law that relates to crime and the legal punishment of criminal offenses.', citation: 'Model Penal Code (1962)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'civil_law', label: 'Civil Law', layer: 2, parent_id: 'law', definition: 'The branch of law dealing with disputes between individuals or organizations, in which compensation may be awarded to the victim.', citation: 'Restatement (Second) of Torts (1965)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'administrative_law', label: 'Administrative Law', layer: 2, parent_id: 'law', definition: 'The body of law that governs the activities of administrative agencies of government.', citation: 'Administrative Procedure Act, 5 U.S.C. § 551 (1946)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1946, temporal_valid_to: '', notes: '' },
  { id: 'tax_law', label: 'Tax Law', layer: 2, parent_id: 'law', definition: 'The body of law concerning the assessment and collection of taxes.', citation: 'Internal Revenue Code, 26 U.S.C. (1954)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1954, temporal_valid_to: '', notes: '' },
  { id: 'international_law', label: 'International Law', layer: 2, parent_id: 'law', definition: 'The set of rules generally regarded and accepted as binding in relations between states and between nations.', citation: 'Vienna Convention on the Law of Treaties (1969)', authority_level: 'contractual', jurisdiction: 'international', temporal_valid_from: 1969, temporal_valid_to: '', notes: '' },
  { id: 'procedural_law', label: 'Procedural Law', layer: 2, parent_id: 'law', definition: 'The body of law that prescribes the methods and mechanisms for enforcing rights and duties.', citation: 'Federal Rules of Civil Procedure (1938)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1938, temporal_valid_to: '', notes: '' },

  // Constitutional Law subdomains
  { id: 'first_amendment', label: 'First Amendment', layer: 3, parent_id: 'constitutional_law', definition: 'Prohibits Congress from making laws respecting an establishment of religion, or prohibiting the free exercise thereof, or abridging the freedom of speech.', citation: 'U.S. Const. amend. I', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1791, temporal_valid_to: '', notes: '' },
  { id: 'fourth_amendment', label: 'Fourth Amendment', layer: 3, parent_id: 'constitutional_law', definition: 'Guards against unreasonable searches and seizures and requires any warrant to be judicially sanctioned and supported by probable cause.', citation: 'U.S. Const. amend. IV', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1791, temporal_valid_to: '', notes: '' },
  { id: 'due_process', label: 'Due Process', layer: 3, parent_id: 'constitutional_law', definition: 'Constitutional requirement that the government must respect all legal rights owed to a person according to the law.', citation: 'U.S. Const. amend. XIV, § 1', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1868, temporal_valid_to: '', notes: '' },
  { id: 'equal_protection', label: 'Equal Protection', layer: 3, parent_id: 'constitutional_law', definition: 'Requires that individuals in similar situations be treated equally by the law.', citation: 'U.S. Const. amend. XIV, § 1', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1868, temporal_valid_to: '', notes: '' },
  { id: 'commerce_clause', label: 'Commerce Clause', layer: 3, parent_id: 'constitutional_law', definition: 'Grants Congress the power to regulate commerce with foreign nations, among the several states, and with Indian tribes.', citation: 'U.S. Const. art. I, § 8, cl. 3', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1789, temporal_valid_to: '', notes: '' },
  { id: 'separation_of_powers', label: 'Separation of Powers', layer: 3, parent_id: 'constitutional_law', definition: 'The division of government responsibilities into distinct branches to limit any one branch from exercising the core functions of another.', citation: 'U.S. Const. arts. I-III', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1789, temporal_valid_to: '', notes: '' },
  { id: 'judicial_review', label: 'Judicial Review', layer: 3, parent_id: 'constitutional_law', definition: 'The power of courts to assess whether a law is in compliance with the constitution.', citation: 'Marbury v. Madison, 5 U.S. 137 (1803)', authority_level: 'common_law', jurisdiction: 'federal', temporal_valid_from: 1803, temporal_valid_to: '', notes: '' },
  { id: 'federalism', label: 'Federalism', layer: 3, parent_id: 'constitutional_law', definition: 'The distribution of power in an organization (such as a government) between a central authority and the constituent units.', citation: 'U.S. Const. amend. X', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1791, temporal_valid_to: '', notes: '' },
  { id: 'executive_power', label: 'Executive Power', layer: 3, parent_id: 'constitutional_law', definition: 'The power vested in the President to enforce and administer the law.', citation: 'U.S. Const. art. II', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1789, temporal_valid_to: '', notes: '' },

  // Criminal Law subdomains
  { id: 'homicide', label: 'Homicide', layer: 3, parent_id: 'criminal_law', definition: 'The act of one human killing another, which may be lawful or unlawful depending on circumstances.', citation: 'Model Penal Code § 210 (1962)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'assault_battery', label: 'Assault and Battery', layer: 3, parent_id: 'criminal_law', definition: 'Assault is an attempt or threat to cause harmful contact; battery is the completed harmful or offensive contact.', citation: 'Model Penal Code § 211 (1962)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'theft_offenses', label: 'Theft Offenses', layer: 3, parent_id: 'criminal_law', definition: 'The unlawful taking of another\'s property with intent to permanently deprive, including larceny, robbery, burglary, and fraud.', citation: 'Model Penal Code § 223 (1962)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'criminal_defenses', label: 'Criminal Defenses', layer: 3, parent_id: 'criminal_law', definition: 'Legal justifications or excuses that negate criminal liability, including self-defense, insanity, duress, and necessity.', citation: 'Model Penal Code §§ 3.01-3.09 (1962)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'criminal_procedure', label: 'Criminal Procedure', layer: 3, parent_id: 'criminal_law', definition: 'The body of law governing the process by which crimes are investigated, prosecuted, adjudicated, and punished.', citation: 'Federal Rules of Criminal Procedure (1944)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1944, temporal_valid_to: '', notes: '' },
  { id: 'mens_rea', label: 'Mens Rea', layer: 3, parent_id: 'criminal_law', definition: 'The mental element of a crime; the intention or knowledge of wrongdoing that constitutes part of a crime.', citation: 'Model Penal Code § 2.02 (1962)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'actus_reus', label: 'Actus Reus', layer: 3, parent_id: 'criminal_law', definition: 'The physical element of a crime; the guilty act or omission that constitutes the external elements of the offense.', citation: 'Model Penal Code § 2.01 (1962)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'sentencing', label: 'Sentencing', layer: 3, parent_id: 'criminal_law', definition: 'The judicial determination of the legal sanction to be imposed on a person found guilty of an offense.', citation: 'U.S. Sentencing Guidelines (1987)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1987, temporal_valid_to: '', notes: '' },

  // Civil Law subdomains
  { id: 'contract_law', label: 'Contract Law', layer: 3, parent_id: 'civil_law', definition: 'The body of law that governs oral and written agreements associated with exchange of goods, services, money, and properties.', citation: 'Restatement (Second) of Contracts (1981)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'tort_law', label: 'Tort Law', layer: 3, parent_id: 'civil_law', definition: 'The body of law that addresses wrongful acts or injuries that result in civil liability, including negligence and intentional torts.', citation: 'Restatement (Second) of Torts (1965)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'property_law', label: 'Property Law', layer: 3, parent_id: 'civil_law', definition: 'The area of law governing various forms of ownership and tenancy in real property and personal property.', citation: 'Restatement (Third) of Property (2000)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'family_law', label: 'Family Law', layer: 3, parent_id: 'civil_law', definition: 'The branch of law dealing with matters related to family relationships, including marriage, divorce, child custody, and adoption.', citation: 'Uniform Marriage and Divorce Act (1970)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: 1970, temporal_valid_to: '', notes: '' },
  { id: 'equity', label: 'Equity', layer: 3, parent_id: 'civil_law', definition: 'A branch of law that developed alongside common law to provide remedies not available at common law, based on principles of fairness.', citation: 'eBay Inc. v. MercExchange, L.L.C., 547 U.S. 388 (2006)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'remedies', label: 'Remedies', layer: 3, parent_id: 'civil_law', definition: 'The means by which a right is enforced or the violation of a right is compensated, including damages, injunctions, and restitution.', citation: 'Restatement (Third) of Restitution and Unjust Enrichment (2011)', authority_level: 'common_law', jurisdiction: 'majority', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'business_law', label: 'Business Law', layer: 3, parent_id: 'civil_law', definition: 'The body of law governing business and commercial transactions, including corporations, partnerships, and agency.', citation: 'Uniform Commercial Code (1952)', authority_level: 'statutory', jurisdiction: 'majority', temporal_valid_from: 1952, temporal_valid_to: '', notes: '' },
  { id: 'ip_law', label: 'Intellectual Property', layer: 3, parent_id: 'civil_law', definition: 'The area of law that deals with creations of the mind, including patents, copyrights, trademarks, and trade secrets.', citation: '35 U.S.C. § 101; 17 U.S.C. § 102', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: '', temporal_valid_to: '', notes: '' },

  // Administrative Law subdomains
  { id: 'agency_authority', label: 'Agency Authority', layer: 3, parent_id: 'administrative_law', definition: 'The scope of power delegated by Congress to administrative agencies to make rules, adjudicate disputes, and enforce statutes.', citation: 'Chevron U.S.A., Inc. v. NRDC, 467 U.S. 837 (1984)', authority_level: 'common_law', jurisdiction: 'federal', temporal_valid_from: 1984, temporal_valid_to: '', notes: '' },
  { id: 'rulemaking', label: 'Rulemaking', layer: 3, parent_id: 'administrative_law', definition: 'The process by which administrative agencies formulate, amend, or repeal rules under the APA.', citation: 'Administrative Procedure Act, 5 U.S.C. § 553', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1946, temporal_valid_to: '', notes: '' },
  { id: 'adjudication_admin', label: 'Administrative Adjudication', layer: 3, parent_id: 'administrative_law', definition: 'The process by which administrative agencies resolve disputes through hearings before administrative law judges.', citation: 'Administrative Procedure Act, 5 U.S.C. § 554', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1946, temporal_valid_to: '', notes: '' },
  { id: 'judicial_review_admin', label: 'Judicial Review of Agency Action', layer: 3, parent_id: 'administrative_law', definition: 'Court review of agency decisions for compliance with constitutional, statutory, and procedural requirements.', citation: 'Administrative Procedure Act, 5 U.S.C. § 706', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1946, temporal_valid_to: '', notes: '' },
  { id: 'regulatory_takings', label: 'Regulatory Takings', layer: 3, parent_id: 'administrative_law', definition: 'Government regulation that goes so far in restricting the use of property as to constitute a taking requiring just compensation.', citation: 'Penn Central Transp. Co. v. City of New York, 438 U.S. 104 (1978)', authority_level: 'constitutional', jurisdiction: 'federal', temporal_valid_from: 1978, temporal_valid_to: '', notes: '' },

  // Tax Law subdomains
  { id: 'income_tax', label: 'Income Tax', layer: 3, parent_id: 'tax_law', definition: 'A tax levied by the government on personal or corporate income.', citation: '26 U.S.C. § 61', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1913, temporal_valid_to: '', notes: '' },
  { id: 'corporate_tax', label: 'Corporate Tax', layer: 3, parent_id: 'tax_law', definition: 'Tax imposed on the net income or profit of corporations, including provisions for deductions and credits.', citation: '26 U.S.C. § 11', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1909, temporal_valid_to: '', notes: '' },
  { id: 'estate_tax', label: 'Estate and Gift Tax', layer: 3, parent_id: 'tax_law', definition: 'Taxes imposed on the transfer of property by inheritance or gift, subject to applicable exclusions and deductions.', citation: '26 U.S.C. §§ 2001, 2501', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1916, temporal_valid_to: '', notes: '' },
  { id: 'tax_procedure', label: 'Tax Procedure', layer: 3, parent_id: 'tax_law', definition: 'The rules governing the administrative and judicial processes for determining and contesting tax liability.', citation: '26 U.S.C. §§ 6201-7482', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'international_tax', label: 'International Tax', layer: 3, parent_id: 'tax_law', definition: 'Rules governing the taxation of income earned across international borders, including transfer pricing and treaty provisions.', citation: '26 U.S.C. §§ 861-999', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: '', temporal_valid_to: '', notes: '' },

  // International Law subdomains
  { id: 'treaty_law', label: 'Treaty Law', layer: 3, parent_id: 'international_law', definition: 'The body of international law governing the negotiation, conclusion, entry into force, and termination of treaties.', citation: 'Vienna Convention on the Law of Treaties, art. 2 (1969)', authority_level: 'contractual', jurisdiction: 'international', temporal_valid_from: 1969, temporal_valid_to: '', notes: '' },
  { id: 'customary_intl_law', label: 'Customary International Law', layer: 3, parent_id: 'international_law', definition: 'International obligations arising from established state practice and opinio juris — the belief that the practice is legally required.', citation: 'Statute of the International Court of Justice, art. 38(1)(b)', authority_level: 'common_law', jurisdiction: 'international', temporal_valid_from: 1945, temporal_valid_to: '', notes: '' },
  { id: 'intl_human_rights', label: 'International Human Rights', layer: 3, parent_id: 'international_law', definition: 'Rights and freedoms to which all humans are entitled, protected under international law.', citation: 'Universal Declaration of Human Rights (1948)', authority_level: 'contractual', jurisdiction: 'international', temporal_valid_from: 1948, temporal_valid_to: '', notes: '' },
  { id: 'intl_trade_law', label: 'International Trade Law', layer: 3, parent_id: 'international_law', definition: 'The rules and customs governing trade between nations, including WTO agreements and bilateral trade treaties.', citation: 'General Agreement on Tariffs and Trade (1947)', authority_level: 'contractual', jurisdiction: 'international', temporal_valid_from: 1947, temporal_valid_to: '', notes: '' },
  { id: 'intl_dispute_resolution', label: 'International Dispute Resolution', layer: 3, parent_id: 'international_law', definition: 'Mechanisms for resolving disputes between states, including ICJ adjudication, arbitration, and diplomatic settlement.', citation: 'Statute of the International Court of Justice, art. 36 (1945)', authority_level: 'contractual', jurisdiction: 'international', temporal_valid_from: 1945, temporal_valid_to: '', notes: '' },

  // Procedural Law subdomains
  { id: 'civil_procedure', label: 'Civil Procedure', layer: 3, parent_id: 'procedural_law', definition: 'The body of law governing the process by which civil lawsuits are conducted in courts.', citation: 'Federal Rules of Civil Procedure (1938)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1938, temporal_valid_to: '', notes: '' },
  { id: 'evidence', label: 'Evidence', layer: 3, parent_id: 'procedural_law', definition: 'The rules governing the admissibility of information presented in legal proceedings.', citation: 'Federal Rules of Evidence (1975)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1975, temporal_valid_to: '', notes: '' },
  { id: 'jurisdiction_venue', label: 'Jurisdiction and Venue', layer: 3, parent_id: 'procedural_law', definition: 'The rules determining which court has authority to hear a case and in which geographic location it should be heard.', citation: '28 U.S.C. §§ 1331-1332, 1391', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: '', temporal_valid_to: '', notes: '' },
  { id: 'appellate_procedure', label: 'Appellate Procedure', layer: 3, parent_id: 'procedural_law', definition: 'The rules governing the process by which a party may seek review of a lower court decision.', citation: 'Federal Rules of Appellate Procedure (1968)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1968, temporal_valid_to: '', notes: '' },
  { id: 'discovery', label: 'Discovery', layer: 3, parent_id: 'procedural_law', definition: 'The pre-trial process by which parties obtain evidence from each other and third parties through depositions, interrogatories, and document requests.', citation: 'Fed. R. Civ. P. 26-37', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1938, temporal_valid_to: '', notes: '' },
  { id: 'pleading', label: 'Pleading', layer: 3, parent_id: 'procedural_law', definition: 'The formal written statements filed by parties that define the issues in dispute, including complaints, answers, and counterclaims.', citation: 'Fed. R. Civ. P. 8-15; Twombly, 550 U.S. 544 (2007)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1938, temporal_valid_to: '', notes: '' },
  { id: 'alternative_dispute_resolution', label: 'Alternative Dispute Resolution', layer: 3, parent_id: 'procedural_law', definition: 'Methods of resolving disputes outside of court, including arbitration, mediation, and negotiation.', citation: 'Federal Arbitration Act, 9 U.S.C. § 1 (1925)', authority_level: 'statutory', jurisdiction: 'federal', temporal_valid_from: 1925, temporal_valid_to: '', notes: '' },
];

const EDGES = NODES
  .filter(n => n.parent_id)
  .map(n => ({
    id: `edge_${n.parent_id}_${n.id}`,
    from_id: n.parent_id,
    to_id: n.id,
    relationship_type: 'legal-hypernym',
    citation: '',
    jurisdiction: n.jurisdiction,
    strength: 'absolute',
    temporal_valid_from: '',
    temporal_valid_to: '',
    notes: ''
  }));

async function post(action, data) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
    redirect: 'follow'
  });
  return res.json();
}

async function seed() {
  console.log(`Seeding ${NODES.length} nodes...`);
  for (const node of NODES) {
    const result = await post('addNode', node);
    if (result.success) {
      process.stdout.write('.');
    } else {
      console.error(`\nFailed to add node ${node.id}: ${result.error}`);
    }
  }
  console.log(`\nSeeding ${EDGES.length} edges...`);
  for (const edge of EDGES) {
    const result = await post('addEdge', edge);
    if (result.success) {
      process.stdout.write('.');
    } else {
      console.error(`\nFailed to add edge ${edge.id}: ${edge.error}`);
    }
  }
  console.log('\nDone.');
}

seed().catch(console.error);
