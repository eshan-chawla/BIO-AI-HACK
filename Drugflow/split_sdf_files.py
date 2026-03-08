# split sdf file
from rdkit import Chem

# Create a unique filename for each molecule (e.g., molecule_1.sdf, molecule_2.sdf)
def split_sdf(input_file, output_prefix):
    suppl = Chem.SDMolSupplier(input_file)
    for i, mol in enumerate(suppl, start=1):
        if mol is None:
            print(f"Invalid molecule at index {i}. Skipping.")
        if mol is not None:
            writer = Chem.SDWriter(f"{output_prefix}_{i}.sdf")
            writer.write(mol)
            writer.close()
    print('splitting complete')

split_sdf('samples.sdf','samples')
