package com.HungTran.MeetingTeam.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.HungTran.MeetingTeam.Exception.FileException;
import com.HungTran.MeetingTeam.Util.InfoChecking;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	@Autowired
	Cloudinary cloudinary;
	@Autowired
	InfoChecking infoChecking;
	public String uploadFile(MultipartFile file,String folder,String url) {
		try {
			String format=file.getContentType().split("/")[1];
			if(format.equals("vnd.openxmlformats-officedocument.wordprocessingml.document"))
				format="docx"; //ms word
			else if(format.equals("vnd.openxmlformats-officedocument.presentationml.presentation"))
				format="pptx"; //powerpoint file
			else if(format.equals("vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
					format="xlsx";
			Map<String, Object> options=ObjectUtils.asMap(
				    "unique_filename", "true",
				    "resource_type","auto",
				    "type","authenticated",
				    "overwrite","true",
				    "invalidate","true",
				    "folder",folder,
				    "format",format);
			if(url!=null) {
				String[] strs=url.split("/");
				System.out.println("Last string plit [.]: "+strs[strs.length-1].split("[.]"));
				String publicId=strs[strs.length-1].split("[.]")[0];
				options.put("public_id",publicId);
			}
			Map<String, Object> result= cloudinary.uploader().upload(file.getBytes(),options);
			return result.get("secure_url").toString();
		} catch (IOException e) {
			e.printStackTrace();
			throw new FileException("Could not save the uploaded file!Please try again!");
		}
	}
	public void deleteFile(String url) {
		String[] strs=url.split("/");
		String publicId=strs[strs.length-1].split(".")[0];
		try {
			cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
		} catch (IOException e) {
			throw new FileException("Sorry! Could not delete the resource");
		}
	}
}
