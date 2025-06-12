# find_correct_model.py
import os
import h5py

def find_all_h5_files():
    """Cari semua file .h5 di folder cap/ml"""
    cap_ml_path = "../cap/ml"
    
    if not os.path.exists(cap_ml_path):
        print(f"❌ Folder tidak ditemukan: {cap_ml_path}")
        return
    
    print(f"🔍 Searching for H5 files in: {cap_ml_path}")
    found_files = []
    
    # Cari semua file .h5
    for root, dirs, files in os.walk(cap_ml_path):
        for file in files:
            if file.endswith('.h5'):
                file_path = os.path.join(root, file)
                found_files.append(file_path)
    
    if not found_files:
        print("❌ No .h5 files found!")
        return
    
    print(f"📁 Found {len(found_files)} H5 files:")
    
    for file_path in found_files:
        print(f"\n{'='*60}")
        print(f"📄 File: {os.path.basename(file_path)}")
        print(f"📍 Path: {file_path}")
        print(f"📊 Size: {os.path.getsize(file_path) / (1024*1024):.2f} MB")
        
        try:
            with h5py.File(file_path, 'r') as f:
                root_keys = list(f.keys())
                print(f"🔑 Root keys: {root_keys}")
                
                # Check for model components
                has_model_weights = 'model_weights' in f
                has_model_config = 'model_config' in f.attrs
                has_layer_names = 'layer_names' in f.attrs
                has_optimizer = 'optimizer' in root_keys
                has_vars = 'vars' in root_keys
                
                print(f"📋 Has model_weights: {has_model_weights}")
                print(f"🏗️  Has model_config: {has_model_config}")
                print(f"🏷️  Has layer_names: {has_layer_names}")
                print(f"🔧 Has optimizer: {has_optimizer}")
                print(f"📦 Has vars: {has_vars}")
                
                # Determine file type
                if has_model_weights and has_model_config:
                    file_type = "✅ COMPLETE MODEL"
                elif has_model_weights:
                    file_type = "⚠️  WEIGHTS ONLY"
                elif has_optimizer or has_vars:
                    file_type = "❌ CHECKPOINT/OPTIMIZER"
                else:
                    file_type = "❓ UNKNOWN"
                
                print(f"🎯 File Type: {file_type}")
                
                # If has model weights, show layer details
                if has_model_weights:
                    weights_group = f['model_weights']
                    layer_count = len([k for k in weights_group.keys() if len(weights_group[k].keys()) > 0])
                    print(f"📊 Layers with weights: {layer_count}")
                    
                    # Show first few layers
                    for i, layer_name in enumerate(list(weights_group.keys())[:3]):
                        layer_group = weights_group[layer_name]
                        print(f"  {i+1}. {layer_name}: {list(layer_group.keys())}")
                
        except Exception as e:
            print(f"❌ Error reading file: {e}")

if __name__ == "__main__":
    find_all_h5_files()
