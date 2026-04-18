PRODUCT_MAP = {
    "Velora AI": "velora_access",
    "Orin AI": "orin_access",
    "Lyra AI": "lyra_access",
    "Cortex AI": "cortex_access",
    "Sera AI": "sera_access",
    "Nexa AI": "nexa_access",
    "Forge AI": "forge_access",
    "Astra AI": "astra_access",
    "Titan AI": "titan_access",
}

def map_product_to_entitlement(product_name: str):
    return PRODUCT_MAP.get(product_name)