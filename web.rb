require 'sinatra'
require 'slim'
require 'nokogiri'
require 'json'
require 'base64'
require 'evernote_oauth'


helpers do

  def token 
    #cuenta real tizapense funcionando 
    #@developer_token = "S=s64:U=6e1a25:E=154885f32de:C=14d30ae0320:P=1cd:A=en-devtoken:V=2:H=04e673f301f338307f75daa5609caa38"
    
    # cuenta que mando arturo por correo
    
    #@developer_token = "S=s474:U=4fd8eee:E=1547c949d77:C=14d24e37138:P=1cd:A=en-devtoken:V=2:H=234b059eb4e02279683000744cfbbdc9"

    

    # mayo 7 sacado por ernesto con la cuenta de identidad ya funciona
    #@developer_token = "S=s474:U=4fd8eee:E=154889b9d95:C=14d30ea6fe0:P=1cd:A=en-devtoken:V=2:H=a6456a71ce76fa260bfb2511b2553d56"

    # julio 7 nuevo dev token de la nueva cuenta de eevernote
    #@developer_token = "S=s594:U=6aba74b:E=155efd3f435:C=14e9822c788:P=1cd:A=en-devtoken:V=2:H=64db8358dd00b0e1ce783f2d211055c4"


    # julio 20 nuevo dev token de la nueva cuenta de evernote
    @developer_token = "S=s594:U=6aba74b:E=156039eb295:C=14eabed8578:P=1cd:A=en-devtoken:V=2:H=6567751cd6566f053cc5f69aef842517"
  end
   
  def client
    @client ||= EvernoteOAuth::Client.new(token: token, sandbox: false)
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

  def all_notes

  @notes = note_store.findNotes(token, Evernote::EDAM::NoteStore::NoteFilter.new, 0, 100).notes
  end

  def all_notes_guid 
  filter = Evernote::EDAM::NoteStore::NoteFilter.new
  spec = Evernote::EDAM::NoteStore::NotesMetadataResultSpec.new
  spec.includeTitle = true
  spec.includeTagGuids = true
  @notes = Array.new

  notebooks.inject(0) do |total_guids, notebook|
    filter.notebookGuid = notebook.guid
    @notes.push(*note_store.findNotesMetadata(token, filter, 0, 1000, spec).notes)
  end

  end

  def graph

    alltags = note_store.listTags
    tagsList = alltags.map do |tag|
    { name: tag.name, type: "tag", url: "none"}
    end


    notesList = all_notes_guid.map do |note|
    { name: note.title, type: "project", tags: note.tagGuids ? note.tagGuids : [], url: note.guid}
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

  def load_pictures
    Dir.glob("public/img/*.{jpg,JPG,gif}")
  end
  
end

##
# Index page
##
#get '/' do
#  @alltags = note_store.listTags
#  
#  slim :index
#end

get '/' do
  
  @pictures = load_pictures
  slim :intro
end

get '/graph' do
  
  slim :graph
end

get '/instrucciones' do
  @pictures = load_pictures
  slim :instrucciones
end
get '/colofon' do
  @pictures = load_pictures
  slim :colofon
end

get '/update' do
  graph
  slim :update
end

get '/:id' do
  # buscar la nota con el id
  @nota = note_store.getNote(token, params[:id],true,true,false,false)
  
  slim :nota
end







