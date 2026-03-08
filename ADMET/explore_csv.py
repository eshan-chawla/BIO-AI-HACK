import pandas as pd
import numpy

csv_file_path = "./ADMET/results/myJobName/pred.csv"

df = pd.read_csv(csv_file_path)

# # Show first 10 rows nicely formatted
# print(df["logP"].head(10))

# Show all the columns
# print(df.columns)

# --- Smiles String ---
smiles_col = ["smiles"]

# --- Physicochemical (matches website Physicochemical) ---
physicochemical_cols = [
    "molecular_weight",
    "logP",
    "hydrogen_bond_acceptors",
    "hydrogen_bond_donors",
    "Lipinski",
    "QED",
    "stereo_centers",
    "tpsa",
]

# --- Absorption (matches website Absorption) ---
# Website includes: HIA, Bioavailability, Aqueous Solubility, Lipophilicity, Hydration FE,
# Cell Effective Permeability, PAMPA, P-gp inhibition
absorption_cols = [
    "HIA_Hou",                      # Human Intestinal Absorption
    "Bioavailability_Ma",           # Oral Bioavailability
    "Solubility_AqSolDB",           # Aqueous Solubility
    "Lipophilicity_AstraZeneca",    # Lipophilicity
    "HydrationFreeEnergy_FreeSolv", # Hydration Free Energy
    "Caco2_Wang",                   # Cell Effective Permeability (proxy/label on site)
    "PAMPA_NCATS",                  # PAMPA Permeability
    "Pgp_Broccatelli",              # P-glycoprotein Inhibition
]

# --- Distribution (matches website Distribution) ---
distribution_cols = [
    "BBB_Martins",                  # Blood-Brain Barrier Penetration
    "PPBR_AZ",                      # Plasma Protein Binding Rate
    "VDss_Lombardo",                # Volume of Distribution at Steady State
]

# --- Metabolism (matches website Metabolism) ---
# Inhibition columns + substrate columns
metabolism_cols = [
    "CYP1A2_Veith",
    "CYP2C19_Veith",
    "CYP2C9_Veith",
    "CYP2D6_Veith",
    "CYP3A4_Veith",
    "CYP2C9_Substrate_CarbonMangels",
    "CYP2D6_Substrate_CarbonMangels",
    "CYP3A4_Substrate_CarbonMangels",
]

# --- Excretion (matches website Excretion) ---
excretion_cols = [
    "Half_Life_Obach",              # Half Life
    "Clearance_Hepatocyte_AZ",      # Drug Clearance (Hepatocyte)
    "Clearance_Microsome_AZ",       # Drug Clearance (Microsome)
]

# --- Toxicity (matches website Toxicity) ---
# Core toxicity + Nuclear receptor + Stress response endpoints shown under Toxicity on site
toxicity_core_cols = [
    "hERG",
    "ClinTox",
    "AMES",                         # Mutagenicity on website
    "DILI",
    "Carcinogens_Lagunin",
    "LD50_Zhu",
    "Skin_Reaction",
]

toxicity_receptor_cols = [
    "NR-AR",
    "NR-AR-LBD",
    "NR-AhR",
    "NR-Aromatase",
    "NR-ER",
    "NR-ER-LBD",
    "NR-PPAR-gamma",
]

toxicity_stress_response_cols = [
    "SR-ARE",
    "SR-ATAD5",
    "SR-HSE",
    "SR-MMP",
    "SR-p53",
]

# If your CSV also has these two and you want them under Toxicity:
toxicity_other_cols = [
    "Mitochondrial Membrane Potential",  # NOTE: your CSV column is "SR-MMP" (already above)
    "Tumor Protein p53",                 # NOTE: your CSV column is "SR-p53" (already above)
]

# ---- Printing (1-row dataframe slices) ----
print(df[smiles_col])
print(df[physicochemical_cols])

print(df[absorption_cols])
print(df[distribution_cols])
print(df[metabolism_cols])
print(df[excretion_cols])

print(df[toxicity_core_cols])
print(df[toxicity_receptor_cols])
print(df[toxicity_stress_response_cols])