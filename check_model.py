import os

# Check current directory
print("Current working directory:", os.getcwd())

# Check if models folder exists
models_dir = os.path.join(os.getcwd(), 'models')
print(f"Models directory exists: {os.path.exists(models_dir)}")

# Check if model.h5 exists
model_path = os.path.join(models_dir, 'model.h5')
print(f"Model file exists: {os.path.exists(model_path)}")

# List files in models directory
if os.path.exists(models_dir):
    print("Files in models directory:")
    for file in os.listdir(models_dir):
        print(f"  - {file}")
        file_path = os.path.join(models_dir, file)
        file_size = os.path.getsize(file_path) / (1024*1024)  # MB
        print(f"    Size: {file_size:.2f} MB")
else:
    print("Models directory does not exist!")

# Check files in cap/ml directory
cap_ml_dir = os.path.join('..', 'cap', 'ml')
if os.path.exists(cap_ml_dir):
    print(f"\nFiles in {cap_ml_dir}:")
    for file in os.listdir(cap_ml_dir):
        if file.endswith('.h5'):
            print(f"  - {file}")
            file_path = os.path.join(cap_ml_dir, file)
            file_size = os.path.getsize(file_path) / (1024*1024)  # MB
            print(f"    Size: {file_size:.2f} MB")
