# ThreeJS advanced techniques - Importing Models (Workshop)

## Formats

One format is becoming a standard and should cover most of our needs: **`GLTF`** (GL Transmission Format)

## Various models for testing

This one is archived

<https://github.com/KhronosGroup/glTF-Sample-Models?tab=readme-ov-file>

<https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0>

<https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Models-core.md>

this one is new:

<https://github.com/KhronosGroup/glTF-Sample-Assets>

<https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models#gltf-20-sample-models>


# GLTF formats

- glTF
- glTF-Binary
- glTF-Draco
- glTF-Embedded

we will download all of this format of a specific model

some formats aren't visible in os, but are visible in vscode

## `.gltf`

JSON format that contains cmeras, lights, scenes, materials. objects transformations, but no geometries and textures

By loading this file other files will also be loaded automatically

## `.bin`

Binary that contains data like geometries (vertices, positions, UV coordinates, normals, color, rtc.)

## `.png`

A texture that goes "over" model


## `.glb` is gltf-binary

only one file
contains all data we talked about
binary
usually lighter
easier to load because it is only one file
hard to alter its data


## gltf-draco

compressed with draco algo
much lighter

## gltf-embedded

one file like gltf-binary
json
heaier

usually we don'yt use this one because it's quite heavy

# Which file to choose

if you want to be able to alter files you go with a gltf-default, loading multiple files can be faster

if having one file is better for you you better go with gltf-binary

You must decide if you want to use draco compression or not

# Multiple ways of adding the mesh to the scene

When we load our model with a loader we can

- Add a whole scene of the model in our scene
- Add a children of the mentioned scene
- filter the children and add what you want
- add only mesh and end up with a mesh that has wrong scale, position and rotation

Best way: **Open a file in a #D software , like blender and clean it (choose only what you want) and export it again**

