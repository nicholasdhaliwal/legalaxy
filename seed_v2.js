const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const APPS_SCRIPT_URL = process.argv[2];
if (!APPS_SCRIPT_URL) { console.error('Usage: node seed_v2.js YOUR_APPS_SCRIPT_URL'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function post(action, data) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
    redirect: 'follow'
  });
  const text = await res.text();
  try { return JSON.parse(text); }
  catch { console.error('\nBad response:', text.slice(0, 200)); return { success: false, error: 'bad response' }; }
}

// ── NODES ─────────────────────────────────────────────────────────────────────
// Layer 1: Root
// Layer 2: Domains (side by side: Criminal Law, Contract Law)
// Layer 3: Subdomains
// Layer 4: Doctrines, specific crimes, specific defenses

const NODES = [
  // L1
  {
    id: 'law', label: 'Law', layer: 1, parent_id: '',
    definition: 'The system of rules created and enforced through social or governmental institutions to regulate behavior.',
    citation: "Black's Law Dictionary (11th ed. 2019)",
    authority_level: 'constitutional', jurisdiction: 'universal',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'Root'
  },

  // L2 — Criminal Law branch
  {
    id: 'criminal_law', label: 'Criminal Law', layer: 2, parent_id: 'law',
    definition: 'Body of law relating to crime and the legal punishment of criminal offenses.',
    citation: 'Model Penal Code (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },

  // L2 — Contract Law branch
  {
    id: 'contract_law', label: 'Contract Law', layer: 2, parent_id: 'law',
    definition: 'Body of law governing oral and written agreements associated with exchange of goods, services, money, and properties.',
    citation: 'Restatement (Second) of Contracts (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },

  // L3 — Criminal Law subdomains
  {
    id: 'homicide', label: 'Homicide', layer: 3, parent_id: 'criminal_law',
    definition: 'The act of one human killing another; may be lawful or unlawful depending on intent and circumstances.',
    citation: 'Model Penal Code § 210.0 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'assault_battery', label: 'Assault & Battery', layer: 3, parent_id: 'criminal_law',
    definition: 'Assault is an attempt or threat to cause harmful contact; battery is the completed harmful or offensive touching.',
    citation: 'Model Penal Code § 211 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'theft_offenses', label: 'Theft Offenses', layer: 3, parent_id: 'criminal_law',
    definition: 'Unlawful taking of another\'s property with intent to permanently deprive, encompassing larceny, robbery, and burglary.',
    citation: 'Model Penal Code § 223 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'criminal_defenses', label: 'Criminal Defenses', layer: 3, parent_id: 'criminal_law',
    definition: 'Legal justifications or excuses that negate or reduce criminal liability.',
    citation: 'Model Penal Code §§ 3.01–3.09 (1962)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },

  // L3 — Contract Law subdomains
  {
    id: 'contract_formation', label: 'Formation', layer: 3, parent_id: 'contract_law',
    definition: 'The process by which a legally binding contract comes into existence, requiring offer, acceptance, and consideration.',
    citation: 'Restatement (Second) of Contracts §§ 22–94 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'contract_breach', label: 'Breach & Performance', layer: 3, parent_id: 'contract_law',
    definition: 'The doctrines governing when a party\'s failure to perform constitutes a breach and what performance is required.',
    citation: 'Restatement (Second) of Contracts §§ 235–243 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'contract_defenses', label: 'Defenses to Formation', layer: 3, parent_id: 'contract_law',
    definition: 'Doctrines that prevent enforcement of an agreement otherwise satisfying formation requirements.',
    citation: 'Restatement (Second) of Contracts §§ 151–185 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },
  {
    id: 'contract_remedies', label: 'Remedies', layer: 3, parent_id: 'contract_law',
    definition: 'Legal and equitable relief available to an aggrieved party upon breach of contract.',
    citation: 'Restatement (Second) of Contracts §§ 344–396 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: ''
  },

  // L4 — Homicide crimes
  {
    id: 'murder', label: 'Murder', layer: 4, parent_id: 'homicide',
    definition: 'The unlawful killing of a human being with malice aforethought, either express or implied.',
    citation: 'Model Penal Code § 210.2 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },
  {
    id: 'felony_murder', label: 'Felony Murder Rule', layer: 4, parent_id: 'homicide',
    definition: 'Doctrine imposing murder liability on a felon whose co-felon causes a death during commission of a dangerous felony, regardless of intent.',
    citation: 'People v. Aaron, 409 Mich. 672 (1980)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'manslaughter', label: 'Manslaughter', layer: 4, parent_id: 'homicide',
    definition: 'The unlawful killing of a human being without malice aforethought, either voluntary (heat of passion) or involuntary (criminal negligence).',
    citation: 'Model Penal Code § 210.3 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },

  // L4 — Assault & Battery crimes
  {
    id: 'simple_assault', label: 'Simple Assault', layer: 4, parent_id: 'assault_battery',
    definition: 'An intentional act that causes a reasonable apprehension of imminent harmful or offensive contact, without aggravating factors.',
    citation: 'Model Penal Code § 211.1(1)(c) (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },
  {
    id: 'aggravated_assault', label: 'Aggravated Assault', layer: 4, parent_id: 'assault_battery',
    definition: 'Assault committed with a deadly weapon or with intent to cause serious bodily injury; a felony in most jurisdictions.',
    citation: 'Model Penal Code § 211.1(2) (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },
  {
    id: 'criminal_battery', label: 'Battery', layer: 4, parent_id: 'assault_battery',
    definition: 'Intentional and unlawful physical contact with another person that is harmful or offensive.',
    citation: 'Model Penal Code § 211.1(1)(a) (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },

  // L4 — Theft crimes
  {
    id: 'larceny', label: 'Larceny', layer: 4, parent_id: 'theft_offenses',
    definition: 'The trespassory taking and carrying away of the personal property of another with intent to permanently deprive.',
    citation: 'Model Penal Code § 223.2 (1962)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },
  {
    id: 'robbery', label: 'Robbery', layer: 4, parent_id: 'theft_offenses',
    definition: 'Larceny accomplished by force or threat of immediate force against a person; a crime against both person and property.',
    citation: 'Model Penal Code § 222.1 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },
  {
    id: 'burglary', label: 'Burglary', layer: 4, parent_id: 'theft_offenses',
    definition: 'Breaking and entering into a structure with intent to commit a felony therein; modernly expanded beyond common-law nighttime dwelling requirement.',
    citation: 'Model Penal Code § 221.1 (1962)',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'crime'
  },

  // L4 — Criminal Defenses
  {
    id: 'self_defense', label: 'Self-Defense', layer: 4, parent_id: 'criminal_defenses',
    definition: 'Justification for the use of force when a person reasonably believes such force is necessary to protect themselves from imminent unlawful force.',
    citation: 'Model Penal Code § 3.04 (1962)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'insanity', label: 'Insanity', layer: 4, parent_id: 'criminal_defenses',
    definition: 'Excuse defense negating mens rea where, due to a severe mental disease, the defendant did not know the nature or wrongfulness of the act.',
    citation: "M'Naghten's Case, 8 Eng. Rep. 718 (H.L. 1843); MPC § 4.01",
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: 1843, temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'duress_crim', label: 'Duress', layer: 4, parent_id: 'criminal_defenses',
    definition: 'Excuse defense where defendant was coerced by threat of imminent death or serious bodily injury to commit the offense.',
    citation: 'Model Penal Code § 2.09 (1962)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'necessity', label: 'Necessity', layer: 4, parent_id: 'criminal_defenses',
    definition: 'Justification defense where commission of a lesser harm was necessary to avoid a greater harm and no legal alternative existed.',
    citation: 'Model Penal Code § 3.02 (1962)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },

  // L4 — Formation doctrines
  {
    id: 'offer', label: 'Offer', layer: 4, parent_id: 'contract_formation',
    definition: 'A manifestation of willingness to enter into a bargain made to justify another in understanding that assent will conclude the contract.',
    citation: 'Restatement (Second) of Contracts § 24 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'acceptance', label: 'Acceptance', layer: 4, parent_id: 'contract_formation',
    definition: 'A manifestation of assent to the terms of an offer made by the offeree in the manner invited or required by the offer.',
    citation: 'Restatement (Second) of Contracts § 50 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'consideration', label: 'Consideration', layer: 4, parent_id: 'contract_formation',
    definition: 'A bargained-for exchange in which each party incurs a legal detriment or confers a legal benefit; required for contract enforceability.',
    citation: 'Restatement (Second) of Contracts § 71 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },

  // L4 — Breach doctrines
  {
    id: 'material_breach', label: 'Material Breach', layer: 4, parent_id: 'contract_breach',
    definition: 'A failure of performance so substantial that it defeats the purpose of the contract, excusing the non-breaching party from further performance.',
    citation: 'Restatement (Second) of Contracts § 241 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'minor_breach', label: 'Minor Breach', layer: 4, parent_id: 'contract_breach',
    definition: 'A partial failure of performance that does not defeat the purpose of the contract; the non-breaching party must still perform but may sue for damages.',
    citation: 'Restatement (Second) of Contracts § 236 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'anticipatory_repudiation', label: 'Anticipatory Repudiation', layer: 4, parent_id: 'contract_breach',
    definition: 'A clear, positive, and unconditional refusal to perform a contractual obligation before performance is due.',
    citation: 'Hochster v. De La Tour, 118 Eng. Rep. 922 (Q.B. 1853)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: 1853, temporal_valid_to: '', notes: 'doctrine'
  },

  // L4 — Defenses to formation
  {
    id: 'fraud', label: 'Fraud', layer: 4, parent_id: 'contract_defenses',
    definition: 'A misrepresentation of material fact, knowingly made, intended to induce reliance, and actually relied upon to the plaintiff\'s detriment.',
    citation: 'Restatement (Second) of Contracts § 162 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'duress_contract', label: 'Duress', layer: 4, parent_id: 'contract_defenses',
    definition: 'A threat that induces assent to a contract by leaving no reasonable alternative; renders the agreement voidable.',
    citation: 'Restatement (Second) of Contracts § 175 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'mistake', label: 'Mistake', layer: 4, parent_id: 'contract_defenses',
    definition: 'A belief not in accord with the facts; mutual mistake as to a basic assumption may render a contract voidable.',
    citation: 'Restatement (Second) of Contracts § 151 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },
  {
    id: 'unconscionability', label: 'Unconscionability', layer: 4, parent_id: 'contract_defenses',
    definition: 'A doctrine allowing courts to refuse enforcement of contracts that are oppressively one-sided in terms or bargaining process.',
    citation: 'UCC § 2-302; Restatement (Second) of Contracts § 208',
    authority_level: 'statutory', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'defense'
  },

  // L4 — Remedies
  {
    id: 'expectation_damages', label: 'Expectation Damages', layer: 4, parent_id: 'contract_remedies',
    definition: 'Damages designed to put the non-breaching party in the position they would have occupied had the contract been performed.',
    citation: 'Restatement (Second) of Contracts § 347 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'reliance_damages', label: 'Reliance Damages', layer: 4, parent_id: 'contract_remedies',
    definition: 'Damages that reimburse the non-breaching party for expenditures made in reliance on the contract.',
    citation: 'Restatement (Second) of Contracts § 349 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'restitution', label: 'Restitution', layer: 4, parent_id: 'contract_remedies',
    definition: 'Recovery of the benefit conferred on the breaching party, measured by unjust enrichment rather than contract price.',
    citation: 'Restatement (Third) of Restitution § 38 (2011)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
  {
    id: 'specific_performance', label: 'Specific Performance', layer: 4, parent_id: 'contract_remedies',
    definition: 'Equitable remedy compelling actual performance of a contractual obligation, available when monetary damages are inadequate.',
    citation: 'Restatement (Second) of Contracts § 360 (1981)',
    authority_level: 'common_law', jurisdiction: 'majority',
    temporal_valid_from: '', temporal_valid_to: '', notes: 'doctrine'
  },
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

async function seed() {
  // Step 1: clear existing data
  console.log('Clearing existing data...');
  const clearResult = await post('clearData', {});
  if (!clearResult.success) {
    console.error('Clear failed:', clearResult.error);
    process.exit(1);
  }
  console.log('Cleared.');
  await sleep(1000);

  // Step 2: seed nodes
  console.log(`Seeding ${NODES.length} nodes...`);
  for (const node of NODES) {
    await sleep(600);
    const result = await post('addNode', node);
    if (result.success) process.stdout.write('.');
    else console.error(`\nFailed node ${node.id}: ${result.error}`);
  }

  // Step 3: seed edges
  console.log(`\nSeeding ${EDGES.length} edges...`);
  for (const edge of EDGES) {
    await sleep(600);
    const result = await post('addEdge', edge);
    if (result.success) process.stdout.write('.');
    else console.error(`\nFailed edge ${edge.id}: ${result.error}`);
  }

  console.log('\nDone.');
}

seed().catch(console.error);
