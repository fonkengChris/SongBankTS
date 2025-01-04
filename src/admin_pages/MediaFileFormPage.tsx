import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Select,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import APIClient from "../services/api-client";
import SongMedia from "../entities/SongMedia";
import Song from "../entities/Song";
import Notation from "../entities/Notation";

const MediaFileFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  const [songs, setSongs] = useState<Song[]>([]);
  const [notations, setNotations] = useState<Notation[]>([]);
  const [formData, setFormData] = useState({
    song: "",
    notation: "",
    documentFile: "",
    audioFile: "",
    previewImage: "",
  });

  const mediaApiClient = new APIClient<SongMedia>("/api/media_files");
  const songsApiClient = new APIClient<Song>("/api/songs");
  const notationsApiClient = new APIClient<Notation>("/api/notations");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, notationsData] = await Promise.all([
          songsApiClient.getAll(),
          notationsApiClient.getAll(),
        ]);
        setSongs(songsData);
        setNotations(notationsData);

        if (id) {
          const mediaData = await mediaApiClient.get(id);
          setFormData({
            song: mediaData.song._id,
            notation: mediaData.notation._id,
            documentFile: mediaData.documentFile,
            audioFile: mediaData.audioFile,
            previewImage: mediaData.previewImage,
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          status: "error",
          duration: 3000,
        });
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await mediaApiClient.put(id, formData);
        toast({
          title: "Media file updated successfully",
          status: "success",
          duration: 3000,
        });
      } else {
        await mediaApiClient.post(formData);
        toast({
          title: "Media file created successfully",
          status: "success",
          duration: 3000,
        });
      }
      navigate("/admin/media_files");
    } catch (error) {
      console.error("Error saving media file:", error);
      toast({
        title: "Error saving media file",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">
          {id ? "Edit Media File" : "Add New Media File"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="blue.500">Song</FormLabel>
              <Select
                name="song"
                value={formData.song}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              >
                <option value="">Select a song</option>
                {songs.map((song) => (
                  <option key={song._id} value={song._id}>
                    {song.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Notation</FormLabel>
              <Select
                name="notation"
                value={formData.notation}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              >
                <option value="">Select a notation</option>
                {notations.map((notation) => (
                  <option key={notation._id} value={notation._id}>
                    {notation.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="blue.500">Document File</FormLabel>
              <Input
                name="documentFile"
                value={formData.documentFile}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="blue.500">Audio File</FormLabel>
              <Input
                name="audioFile"
                value={formData.audioFile}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="blue.500">Preview Image</FormLabel>
              <Input
                name="previewImage"
                value={formData.previewImage}
                onChange={handleChange}
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/media_files")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update Media File" : "Create Media File"}
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default MediaFileFormPage;
