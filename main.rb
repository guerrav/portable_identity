require 'sinatra'
require 'slim'
require 'nokogiri'
require 'json'
require 'base64'
require 'sinatra/reloader' if development?
require 'evernote_oauth'



helpers do

  def token 
    @developer_token = "S=s1:U=90b02:E=1541c4f153c:C=14cc49de768:P=1cd:A=en-devtoken:V=2:H=87f067b71c65feb0936ffc5d84527527"

  end
   
  def client
    @client ||= EvernoteOAuth::Client.new(token: token)
  end

  def user_store
    @user_store ||= client.user_store
  end

  def note_store
    @note_store ||= client.note_store
  end

  def en_user
    user_store.getUser(token)
  end

  def notebooks
    @notebooks ||= note_store.listNotebooks(token)
  end

  def total_note_count
    filter = Evernote::EDAM::NoteStore::NoteFilter.new
    counts = note_store.findNoteCounts(token, filter, false)
    notebooks.inject(0) do |total_count, notebook|
      total_count + (counts.notebookCounts[notebook.guid] || 0)
    end
  end

  def total_note_count
    filter = Evernote::EDAM::NoteStore::NoteFilter.new
    counts = note_store.findNoteCounts(token, filter, false)
    notebooks.inject(0) do |total_count, notebook|
      total_count + (counts.notebookCounts[notebook.guid] || 0)
    end
  end

  def all_notes

  @notes = note_store.findNotes(token, Evernote::EDAM::NoteStore::NoteFilter.new, 0, 100).notes
  end

  def all_notes_guid  
  spec = Evernote::EDAM::NoteStore::NotesMetadataResultSpec.new
  spec.includeTitle = true
  spec.includeTagGuids = true
  @notes = note_store.findNotesMetadata(token, Evernote::EDAM::NoteStore::NoteFilter.new, 0, 100, spec).notes
  end

  def graph

  alltags = note_store.listTags
  tagsList = alltags.map do |tag|
  { name: tag.name, type: "tag"}
  end

  notesList = all_notes_guid.map do |note|
  { name: note.title, type: "project", tags: note.tagGuids, url: note.guid}
  end
  nodeList = tagsList.push(*notesList)

  File.open("public/js/nodeList.json","w") do |f|
    f.write(nodeList.to_json)
  end

  file = File.read("public/js/nodeList.json")
  data_hash = JSON.parse(file)

  linksList = Array.new
  
  data_hash.each_with_index do |node,index|
    if node["type"].to_s == "project"
      if node["type"].to_s == "project"
        node["tags"].each do |tag|
          alltags.each_with_index do |alltag, tagindex|
            if alltag.guid.to_s == tag.to_s
                  
              linksList.push({ source: index, target: tagindex})
            end
          end
        end
        #linksList.push({ source: index})
      end

    end
    #@count = linksList
  end

  projects = { links: linksList, nodes: nodeList}
  
  File.open("public/js/projects.json","w") do |f|
    f.write(projects.to_json)
  end
 
  end
  
end

##
# Index page
##
get '/' do
  @alltags = note_store.listTags
  notas
  
  slim :index
end

get '/graph' do
  #graph
  slim :graph
end



get '/:id' do
  # buscar la nota con el id
  @nota = note_store.getNote(token, params[:id],true,true,false,false)
  
  slim :nota
end







