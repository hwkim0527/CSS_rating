import os

def upload_directory_to_gcs(local_dir, bucket_name, gcs_prefix):
    """
    로컬 디렉토리(예: trained_adapter/)의 모든 파일을 구글 클라우드 스토리지(GCS) 버킷에 업로드
    """
    print(f"[GCP-GCS] '{local_dir}' 디렉토리를 GCS 버킷 '{bucket_name}/{gcs_prefix}'에 업로드 시도 중...")
    try:
        from google.cloud import storage
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        
        for root, _, files in os.walk(local_dir):
            for file in files:
                local_path = os.path.join(root, file)
                relative_path = os.path.relpath(local_path, local_dir)
                gcs_path = os.path.join(gcs_prefix, relative_path).replace("\\", "/")
                
                blob = bucket.blob(gcs_path)
                blob.upload_from_filename(local_path)
                print(f" -> GCS 업로드 성공: {gcs_path}")
        print("[GCP-GCS] 모든 모델 어댑터 가중치 파일이 성공적으로 클라우드에 백업되었습니다.")
        return True
    except ImportError:
        print("[GCP-GCS] [경고] 'google-cloud-storage' 라이브러리가 설치되지 않았습니다. 업로드를 건너뜁니다.")
        return False
    except Exception as e:
        print(f"[GCP-GCS] [경고] GCS 업로드 실패 (계정 권한 확인 필요): {e}")
        return False

def download_directory_from_gcs(bucket_name, gcs_prefix, local_dir):
    """
    GCS 버킷의 가중치 폴더를 로컬 디렉토리로 다운로드
    """
    print(f"[GCP-GCS] GCS 버킷 '{bucket_name}/{gcs_prefix}'로부터 로컬 '{local_dir}'로 다운로드 시도 중...")
    try:
        from google.cloud import storage
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        
        blobs = bucket.list_blobs(prefix=gcs_prefix)
        os.makedirs(local_dir, exist_ok=True)
        
        count = 0
        for blob in blobs:
            relative_path = os.path.relpath(blob.name, gcs_prefix)
            local_path = os.path.join(local_dir, relative_path)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            blob.download_to_filename(local_path)
            print(f" -> 로컬 다운로드 성공: {local_path}")
            count += 1
            
        print(f"[GCP-GCS] 총 {count}개의 가중치 파일이 클라우드로부터 복원되었습니다.")
        return True
    except ImportError:
        print("[GCP-GCS] [경고] 'google-cloud-storage' 라이브러리가 설치되지 않았습니다. 다운로드를 건너뜁니다.")
        return False
    except Exception as e:
        print(f"[GCP-GCS] [경고] GCS 다운로드 실패: {e}")
        return False
