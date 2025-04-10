import React, { useState, useRef } from "react";
import { MdDelete } from "react-icons/md";

function DynamicForm({ fields, setFields }) {
 
  const lastFieldRef = useRef(null); 

  
  const addField = () => {
    const newField = {
      id: Date.now(),
      label: "New Label",
      type: "text",
      value: "",
      preview: null, 
      options: ["Option 1", "Option 2", "Option 3"], 
    };

    setFields((prevFields) => [...prevFields, newField]);;

    
    setTimeout(() => {
      if (lastFieldRef.current) {
        lastFieldRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

 
  const updateField = (id, key, value) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  
  const handleFileUpload = (id, file) => {
    const filePreview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    setFields(
      fields.map((field) =>
        field.id === id
          ? { ...field, value: file.name, preview: filePreview }
          : field
      )
    );
  };

  
  const updateOptions = (id, optionsString) => {
    const options = optionsString.split(",").map((option) => option.trim());
    setFields(
      fields.map((field) => (field.id === id ? { ...field, options } : field))
    );
  };

 
  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div className="p-1">
      <div className="mb-4">
        <button
          onClick={addField}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Field
        </button>
      </div>
      <form className="space-y-1 ">
        {fields?.map((field, index) => (
          <div
            key={field.id}
            ref={index === fields.length - 1 ? lastFieldRef : null}
            className="flex  p-3 rounded items-center justify-between flex-col md:flex-row gap-3 md:gap-0 "
          >
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, "label", e.target.value)}
              className=" p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] w-[100%] md:w-[40%] "
              placeholder="Edit Label"
            />

            {/* <select
              value={field.type}
              onChange={(e) => updateField(field.id, "type", e.target.value)}
              className="  p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="date">Date</option>
              <option value="textarea">Textarea</option>
              <option value="file">File</option>
              <option value="select">Select</option>
            </select> */}

            {field.type === "textarea" ? (
              <textarea
                value={field.value}
                onChange={(e) => updateField(field.id, "value", e.target.value)}
                placeholder={field.label}
                className=" px-6 py-4 h-28   p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] "
              />
            ) : field.type === "file" ? (
              <div className=" relative">
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileUpload(field.id, e.target.files[0])
                  }
                  className="   p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
                />

                {field.preview ? (
                  <img
                    src={field.preview}
                    alt="Preview"
                    className=" size-10 object-cover absolute top-0  right-10 rounded-full"
                  />
                ) : field.value ? (
                  <p className="mt-2">{field.value}</p>
                ) : null}
              </div>
            ) : field.type === "select" ? (
              <div>
                <select
                  value={field.value}
                  onChange={(e) =>
                    updateField(field.id, "value", e.target.value)
                  }
                  className="  p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
                >
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={field.options.join(", ")}
                  onChange={(e) => updateOptions(field.id, e.target.value)}
                  placeholder="Edit options (comma-separated)"
                  className="  p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
                />
              </div>
            ) : (
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => updateField(field.id, "value", e.target.value)}
                placeholder={field.label}
                className="  p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] w-[100%] md:w-[50%]"
              />
            )}

            <button
              type="button"
              onClick={() => deleteField(field.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}

export default DynamicForm;
