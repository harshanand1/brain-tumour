
import os
import hashlib

def calculate_hash(file_path):
    with open(file_path, 'rb') as f:
        image_data = f.read()
        return hashlib.md5(image_data).hexdigest()

def delete_duplicate_images(folder_path):
    image_hashes = {}
    duplicates = []

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        if os.path.isfile(file_path):
            image_hash = calculate_hash(file_path)

            if image_hash in image_hashes:
                duplicates.append(file_path)
            else:
                image_hashes[image_hash] = file_path

    # Delete duplicate images
    for duplicate_file in duplicates:
        os.remove(duplicate_file)
        print(f"Deleted duplicate image: {duplicate_file}")

# Accept folder path as input from the user
folder_path = input("Enter the folder path: ")
delete_duplicate_images(folder_path)